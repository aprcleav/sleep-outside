document.querySelectorAll(".product-card").forEach(card => {
    const suggestedRetailPrice = parseFloat(card.dataset.srp);
    const finalPrice = parseFloat(card.dataset.final);

    const badge = card.querySelector(".discount-badge");

    if (finalPrice < suggestedRetailPrice) {
        const discountPercent = Math.round(
            ((suggestedRetailPrice - finalPrice) / suggestedRetailPrice) * 100
        );

        badge.style.display = "inline-block";
        badge.textContent = `${discountPercent}% OFF`;
    }
});
