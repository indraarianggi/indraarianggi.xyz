// Client-side script to add copy buttons to code blocks
function initCodeCopyButtons() {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addCopyButtons);
  } else {
    addCopyButtons();
  }
}

function addCopyButtons() {
  // Find all pre elements that contain code
  const codeBlocks = document.querySelectorAll("pre:has(code)");

  codeBlocks.forEach((pre) => {
    // Skip if copy button already exists
    if (pre.querySelector(".copy-button")) {
      return;
    }

    // Make the pre element relative positioned for absolute button positioning
    // pre.style.position = "relative";

    // Get the code content
    const codeElement = pre.querySelector("code");
    if (!codeElement) return;

    // Extract text content, preserving line breaks
    const codeText = codeElement.textContent || "";

    // Create copy button
    const copyButton = createCopyButton(codeText);

    // Add button to the pre element
    pre.appendChild(copyButton);
  });
}

function createCopyButton(codeText) {
  const button = document.createElement("button");
  button.className = "copy-button";
  button.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
    <span>Copy</span>
  `;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(codeText);

      // Update button appearance
      button.classList.add("copied");
      button.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
        <span>Copied!</span>
      `;

      // Reset after 2 seconds
      setTimeout(() => {
        button.classList.remove("copied");
        button.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span>Copy</span>
        `;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  });

  return button;
}

// Auto-initialize when script loads
initCodeCopyButtons();
