document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/offers.json');
        if (!response.ok) {
            return;
        }

        const data = await response.json();
        const offers = data.offers || [];

        const statusById = new Map();
        offers.forEach((offer) => {
            if (offer.id) {
                statusById.set(offer.id, offer.status);
            }
        });

        const hiddenStatuses = new Set(['hidden', 'archived', 'draft']);

        document.querySelectorAll('.card[data-offer-id]').forEach((card) => {
            const offerId = card.getAttribute('data-offer-id');
            const status = statusById.get(offerId);

            if (status && hiddenStatuses.has(status)) {
                card.classList.add('is-hidden');
            }
        });
    } catch (error) {
        console.error('Не удалось загрузить статусы офферов:', error);
    }
});
