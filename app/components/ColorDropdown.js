import { useState, useEffect } from "react";
import mqtt from "mqtt";

const ColorDropdown = () => {
  const [client, setClient] = useState(null);
  const [color, setColor] = useState("#ffffff");
  const colors = [
    { name: "Red", hex: "#ff0000" },
    { name: "Green", hex: "#00ff00" },
    { name: "Blue", hex: "#0000ff" },
    { name: "Yellow", hex: "#ffff00" },
    { name: "Purple", hex: "#800080" },
  ];

  useEffect(() => {
    console.log("Attempting to connect to MQTT broker...");
    const mqttClient = mqtt.connect("ws://test.mosquitto.org:8080/mqtt");

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe("app/color", (err) => {
        if (!err) {
          console.log("Subscribed to app/color");
        } else {
          console.error("Subscription error: ", err);
        }
      });
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === "app/color") {
        console.log("Message received: ", message.toString());
        setColor(message.toString());
      }
    });

    mqttClient.on("error", (err) => {
      console.error("Connection error: ", err);
    });

    mqttClient.on("close", () => {
      console.log("Connection closed");
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  const handleChange = (event) => {
    const selectedColor = event.target.value;
    setColor(selectedColor);
    if (client) {
      client.publish("app/color", selectedColor);
      console.log("Published message: ", selectedColor);
    }
  };

  return (
    <div
      className="text-black"
      style={{
        backgroundColor: color,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <select onChange={handleChange}>
        {colors.map((colorOption) => (
          <option key={colorOption.hex} value={colorOption.hex}>
            {colorOption.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ColorDropdown;
