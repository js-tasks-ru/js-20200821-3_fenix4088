class Tooltip {
  static instace;
  element;

  constructor() {
    if (typeof Tooltip.instace === "object") {
      return Tooltip.instace;
    }
    Tooltip.instace = this;
  }

  render(nodeElement) {
    this.element = document.createElement("div");
    this.element.className = "tooltip";
    this.element.innerHTML = nodeElement;

    document.body.append(this.element);
  }

  initEventListeners() {
    document.addEventListener("pointerover", this.cursorOver.bind(this));
    document.addEventListener("pointerout", this.cursorOut.bind(this));
  }

  cursorOver(e) {
    const hoveredElement = e.target.closest("[data-tooltip]");
    if (hoveredElement) {
      this.render(hoveredElement.dataset.tooltip);
      document.addEventListener("pointermove", this.cursoreMove.bind(this));
    }
  }

  cursorOut(e) {
    this.remove();
  }

  cursoreMove(e) {
    const tooltipPosX = e.clientX + 10;
    const tooltipPosY = e.clientY + 10;
    if (this.element) {
      this.element.style.left = `${tooltipPosX}px`;
      this.element.style.top = `${tooltipPosY}px`;
    }
  }

  initialize() {
    this.initEventListeners();
  }

  destroy() {
    document.removeEventListener("pointerover", this.cursorOver.bind(this));
    document.removeEventListener("pointerout", this.cursorOut.bind(this));
    this.remove();
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
      document.removeEventListener("pointermove", this.cursoreMove.bind(this));
    }
  }
}

const tooltip = new Tooltip();

export default tooltip;
