// Alternar entre Mensual y Anual
const toggleButtons = document.querySelectorAll('.toggle-btn');
const priceAmounts = document.querySelectorAll('.amount');
const periodText = document.querySelectorAll('.plan-period');

// Tasas de conversión de moneda (ejemplo)
const exchangeRates = {
  usd: { symbol: '$', rate: 1 },
  eur: { symbol: '€', rate: 0.85 },
  gbp: { symbol: '£', rate: 0.73 }
};

function updatePrices(period) {
  const currencySelect = document.getElementById('currencySelect');
  const currency = currencySelect.value;
  const currencySymbol = exchangeRates[currency].symbol;
  
  priceAmounts.forEach(amount => {
    const monthlyPrice = amount.dataset.monthly;
    const yearlyPrice = amount.dataset.yearly;
    
    if (monthlyPrice && yearlyPrice) {
      const price = period === 'monthly' ? monthlyPrice : yearlyPrice;
      const convertedPrice = (price * exchangeRates[currency].rate).toFixed(2);
      
      amount.textContent = `${currencySymbol}${convertedPrice}`;
      
      // Mostrar/ocultar badge de ahorro
      const savingsBadge = amount.parentNode.querySelector('.savings-badge');
      
      if (period === 'yearly') {
        const monthlyPriceUSD = monthlyPrice * exchangeRates[currency].rate;
        const yearlyPriceUSD = yearlyPrice * exchangeRates[currency].rate;
        const savings = ((monthlyPriceUSD * 12) - (yearlyPriceUSD * 12)) / (monthlyPriceUSD * 12) * 100;
        
        if (!savingsBadge) {
          const newSavingsBadge = document.createElement('span');
          newSavingsBadge.className = 'savings-badge';
          newSavingsBadge.textContent = `Ahorras ${Math.round(savings)}%`;
          amount.parentNode.appendChild(newSavingsBadge);
        } else {
          savingsBadge.textContent = `Ahorras ${Math.round(savings)}%`;
        }
      } else if (savingsBadge) {
        savingsBadge.remove();
      }
    }
  });
  
  // Actualizar texto del período
  periodText.forEach(text => {
    text.textContent = period === 'monthly' ? '/mes' : '/año';
  });
}

// Event listeners para los botones de alternancia
toggleButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Actualizar estado activo
    toggleButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Actualizar precios
    const period = button.dataset.period;
    updatePrices(period);
  });
});

// Event listener para selector de moneda
document.getElementById('currencySelect').addEventListener('change', () => {
  const activePeriod = document.querySelector('.toggle-btn.active').dataset.period;
  updatePrices(activePeriod);
});

// Manejar clics en los botones de planes
document.querySelectorAll('.plan-button').forEach(button => {
  button.addEventListener('click', (e) => {
    const planCard = e.target.closest('.plan-card');
    const planName = planCard.querySelector('.plan-name').textContent;
    const period = document.querySelector('.toggle-btn.active').dataset.period;
    const currency = document.getElementById('currencySelect').value;
    const currencySymbol = exchangeRates[currency].symbol;
    
  console.log(`Plan seleccionado: ${planName} (${period}, ${currency})`);
    
  // Mostrar modal de confirmación (puedes reemplazar con tu lógica)
  showConfirmationModal(planName, period, currencySymbol);
  });
});

// Función para mostrar modal de confirmación
function showConfirmationModal(planName, period, currencySymbol) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;
  
  modal.innerHTML = `
    <div style="
      background: var(--bg-secondary);
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      max-width: 400px;
      width: 90%;
    ">
      <h3 style="margin-bottom: 1rem;">Confirmar Selección</h3>
      <p style="margin-bottom: 2rem; color: var(--text-secondary);">
        Has seleccionado el plan <strong>${planName}</strong> 
        (${period === 'monthly' ? 'Mensual' : 'Anual'})
      </p>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="btn-cancel" style="
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
        ">Cancelar</button>
        <button class="btn-confirm" style="
          background: var(--text-primary);
          color: var(--bg-primary);
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        ">Continuar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Event listeners para botones del modal
  modal.querySelector('.btn-cancel').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.btn-confirm').addEventListener('click', () => {
    alert(`¡Perfecto! Procederemos con la compra del plan ${planName}`);
    document.body.removeChild(modal);
  });
  
  // Cerrar modal al hacer click fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// Funcionalidad del menú móvil
function initMobileMenu() {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  
  if (window.innerWidth <= 768) {
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-toggle';
    menuButton.innerHTML = '☰';
    header.insertBefore(menuButton, nav);
    
    menuButton.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click en un link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
      });
    });
  }
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  
  // Inicializar precios
  updatePrices('monthly');
});

// Reinicializar el menú móvil al cambiar el tamaño
window.addEventListener('resize', initMobileMenu);