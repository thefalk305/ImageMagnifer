window.addEventListener("DOMContentLoaded", () => {
  let magnifierActive = false;
  let currentZoom = 2;
  let glass = null;

  // Toggle button logic
  const toggleBtn = document.getElementById("magToggle");
  const zoomInput = document.getElementById("magStrength");

  if (toggleBtn && zoomInput) {
    toggleBtn.addEventListener("click", () => {
      magnifierActive = !magnifierActive;

      if (magnifierActive) {
        const inputVal = zoomInput.value;
        const zoom = parseFloat(inputVal);
        currentZoom = isNaN(zoom) || zoom < 1 || zoom > 10 ? 2 : zoom;

        magnify("myimage", currentZoom);
      } else {
        if (glass && glass.parentElement) {
          glass.parentElement.removeChild(glass);
          glass = null;
        }
      }
    });
  }

  // Magnifier setup
  function magnify(imgID, zoom) {
    const img = document.getElementById(imgID);
    const zone = document.getElementById("magnifier-zone");

    if (!img) return;

    glass = document.createElement("div");
    glass.setAttribute("class", "img-magnifier-glass");
    img.parentElement.insertBefore(glass, img);

    glass.style.backgroundImage = `url('${img.src}')`;
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;
    glass.style.display = "block";

    const bw = 3;
    const w = glass.offsetWidth / 2;
    const h = glass.offsetHeight / 2;

    // Hover behavior (optional)
    if (zone) {
      zone.addEventListener("mouseover", () => {
        glass.style.display = "block";
      });
      zone.addEventListener("mouseout", () => {
        glass.style.display = "none";
      });
    }

    function getCursorPos(e) {
      const rect = img.getBoundingClientRect();
      const x = e.pageX - rect.left - window.pageXOffset;
      const y = e.pageY - rect.top - window.pageYOffset;
      return { x, y };
    }

    function moveMagnifier(e) {
      e.preventDefault();
      const pos = getCursorPos(e);
      let x = pos.x;
      let y = pos.y;

      if (x > img.width - (w / zoom)) x = img.width - (w / zoom);
      if (x < w / zoom) x = w / zoom;
      if (y > img.height - (h / zoom)) y = img.height - (h / zoom);
      if (y < h / zoom) y = h / zoom;

      glass.style.left = `${x - w}px`;
      glass.style.top = `${y - h}px`;
      glass.style.backgroundPosition = `-${(x * zoom) - w + bw}px -${(y * zoom) - h + bw}px`;
    }

    img.addEventListener("mousemove", moveMagnifier);
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier, { passive: false });
    glass.addEventListener("touchmove", moveMagnifier, { passive: false });
  }

  // Optional: Start magnification by default
  magnify("myimage", 2);
});