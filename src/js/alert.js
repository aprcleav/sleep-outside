export default class Alert {
  constructor(jsonFile = "./alerts.json") {
    this.jsonFile = jsonFile;
  }

  async loadAlerts() {
    try {
      const response = await fetch(this.jsonFile);

      if (!response.ok) {
        throw new Error("Unable to load alerts.");
      }

      const alerts = await response.json();

      if (!alerts.length) return;

      this.renderAlerts(alerts);
    } catch (error) {
      console.error("Error loading alerts:", error);
    }
  }

  renderAlerts(alerts) {
    const alertSection = document.createElement("section");
    alertSection.classList.add("alert-list");

    alerts.forEach((alert) => {
      const p = document.createElement("p");
      p.textContent = alert.message;
      p.style.backgroundColor = alert.background;
      p.style.color = alert.color;
      p.style.padding = "1rem";
      p.style.margin = "0";

      alertSection.appendChild(p);
    });

    const main = document.querySelector("main");

    if (main) {
      main.prepend(alertSection);
    }
  }
}
