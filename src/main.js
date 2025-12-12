document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 0;
  const nextBtn = document.querySelectorAll('.next-btn')
  const backBtn = document.querySelectorAll('.go-back-btn')
  const confirmBtn = document.querySelectorAll('.confirm-btn')
  const changeItems = document.getElementById('changeItems')

  const nameInput = document.querySelector('input[placeholder="John Doe"]');
  const emailInput = document.querySelector('input[placeholder="example@lorem.com"]');
  const phoneInput = document.querySelector('input[placeholder="+1 234 567 890"]');
  
  const planCards = document.querySelectorAll('.plan-container');
  const periodToggle = document.getElementById('customToggle');
  const monthlyLabel = document.querySelector('.custom-toggle-container').previousElementSibling;
  const yearlyLabel = document.querySelector('.custom-toggle-container').nextElementSibling;

  const addonCards = document.querySelectorAll('#addOnsSection .item-hover');
  const summaryPlanPrice = document.querySelector('.plans-summary .clr-blue-950');
  const summaryAddonsContainer = document.querySelector('.add-ons-summary');
  const summaryTotalLabel = document.querySelector('.planTypeConfirmation');
  const summaryTotalAmount = document.getElementById('totalAmount');

  let isYearly = false;
  let selectedPlan = {name : 'Arcade', price : 9, elementIndex : 0};
  let selectedAddons = [];

    const prices = {
    plans: [
      { name: 'Arcade', monthly: 9, yearly: 90 },
      { name: 'Advanced', monthly: 12, yearly: 120 },
      { name: 'Pro', monthly: 15, yearly: 150 }
    ],
    addons: [
      { name: 'Online service', monthly: 1, yearly: 10 },
      { name: 'Larger storage', monthly: 2, yearly: 20 },
      { name: 'Customizable profiles', monthly: 2, yearly: 20 }
    ]
  };

 const stepSections = [
    document.getElementById('infoSection'),
    document.getElementById('planSection'),
    document.getElementById('addOnsSection'),
    document.getElementById('summarySection'),
    document.getElementById('thankYou'),
  ]
  const navLinks = document.querySelectorAll('.nav-link')
  const mobileBtnContainer = document.querySelectorAll('.mobile-btn-controls > div');

  function initForm(){
  updateCurrentPage();

    planCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        selectPlan(index);
      });
    });

    periodToggle.addEventListener('change', () => {
      isYearly = periodToggle.checked;
      updatePricingUI();
    });

    addonCards.forEach((card, index) => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      
      card.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
        }
        toggleAddonStyle(card, checkbox.checked);
        updateAddonState(index, checkbox.checked);
      });
    });


  nextBtn.forEach(btn => btn.addEventListener('click', goNext))
  backBtn.forEach(btn => btn.addEventListener('click', goBack))
  confirmBtn.forEach(btn => btn.addEventListener('click', goNext))
  changeItems.addEventListener('click', () => {
  goToStep(1)
  })
}



  function updateCurrentPage() {
   stepSections.forEach((section, index) => {
    if(index === currentStep){
      section.classList.remove('d-none');
      section.classList.add('d-block');
    }
    else{
      section.classList.add('d-none')
      section.classList.remove('d-block')
    }
   });

   navLinks.forEach((navStep, index) => {
  if (index === currentStep || (currentStep === 4 && index === 3)){
    navStep.classList.add('active');
  }
  else{
    navStep.classList.remove('active');
  }
  })

  mobileBtnContainer.forEach(div => div.classList.remove('d-flex'))
  mobileBtnContainer.forEach(div => div.classList.add('d-none'))
  if(currentStep === 0){
    mobileBtnContainer[0].classList.remove('d-none');
    mobileBtnContainer[0].classList.add('d-flex')
  }
  else if(currentStep === 1 || currentStep === 2){
    mobileBtnContainer[1].classList.remove('d-none');
    mobileBtnContainer[1].classList.add('d-flex')
  }
  else if(currentStep === 3){
    mobileBtnContainer[2].classList.remove('d-none');
    mobileBtnContainer[2].classList.add('d-flex')
  }
  };


navLinks.forEach((navStep, index) => {
  navStep.addEventListener('click', () => {
    if(currentStep === 0){
      if(!validateStep1()) return;
    }
    // If user is on the final page, block all nav
    if (currentStep === 4) return
    if (index === 4) return
    goToStep(index)
    
  })
})


function goNext() {
    if (currentStep === 0 && !validateStep1()) return;

    if (currentStep === 2) {
        renderSummary();   
    }

    if (currentStep < stepSections.length - 1) {
        currentStep++;
        updateCurrentPage();
    }
}

  function goBack(){
    if(currentStep > 0){
      currentStep--;
      updateCurrentPage();
    }
  }
  function goToStep(stepIndex){
    currentStep = stepIndex;
    updateCurrentPage();
  }
  function validateStep1(){
    let isValid = true;
    const inputs = [nameInput, emailInput, phoneInput]
    inputs.forEach(input => {
      if(!input.value.trim()){
        input.classList.add('is-invalid')
        isValid = false;
      }
      else{
        input.classList.remove('is-invalid')
      }
    })
      if (emailInput.value.trim() && !/\S+@\S+\.\S+/.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    }
      return isValid;
  }
  function selectPlan(index){
    // removed all class first
    planCards.forEach(card => card.classList.remove('selected'));
    planCards[index].classList.add('selected');

    const planData = prices.plans[index];
    selectedPlan = {
      name : planData.name,
      price : isYearly ? planData.yearly : planData.monthly,
      elementIndex : index
    }
  }

  function updatePricingUI() {
    if (isYearly) {
        yearlyLabel.classList.remove('opacity-50');
        monthlyLabel.classList.add('opacity-50');
    } else {
        yearlyLabel.classList.add('opacity-50');
        monthlyLabel.classList.remove('opacity-50');
    }

    planCards.forEach((card, index) => {
        const priceEl = card.querySelector('.plan-pricing');
        const bonusEl = card.querySelector('.yearly-bonus');
        const planData = prices.plans[index];

        if (isYearly) {
            priceEl.textContent = `$${planData.yearly}/yr`;
            bonusEl.classList.remove('d-none');
        } else {
            priceEl.textContent = `$${planData.monthly}/mo`;
            bonusEl.classList.add('d-none');
        }
    });

    addonCards.forEach((card, index) => {
        const priceSpan = card.querySelector('span.clr-purple-600');
        const addonData = prices.addons[index];
        priceSpan.textContent = isYearly 
            ? `+$${addonData.yearly}/yr` 
            : `+$${addonData.monthly}/mo`;
    });
    selectPlan(selectedPlan.elementIndex);
  }

  function toggleAddonStyle(card, isChecked) {
    if (isChecked) {
        card.classList.add('item-selected');
        card.style.borderColor = 'var(--bs-purple)'; // Visual feedback
    } else {
        card.classList.remove('item-selected');
        card.style.borderColor = 'hsla(0, 0%, 26%, 0.2)';
    }
  }

  function updateAddonState(index, isChecked) {
      if (isChecked) {
          if (!selectedAddons.includes(index)) selectedAddons.push(index);
      } else {
          selectedAddons = selectedAddons.filter(i => i !== index);
      }
  }

    function renderSummary() {
     const summaryPlanName = document.getElementById('planType');
    const periodShort = isYearly ? 'yr' : 'mo';
    const periodLong = isYearly ? 'Yearly' : 'Monthly';

    summaryPlanName.textContent = periodLong;
    summaryPlanName.parentElement.innerHTML = `${selectedPlan.name} (<span id="planType">${periodLong}</span>)`;
    
    summaryPlanPrice.textContent = `$${selectedPlan.price}/${periodShort}`;

    summaryAddonsContainer.innerHTML = '';
    let addonsTotal = 0;

    if (selectedAddons.length > 0) {
        summaryAddonsContainer.innerHTML = '<hr class="mt-2 mb-3" style="width: 95% ;margin: auto; opacity: 0.1;">';
        selectedAddons.forEach(index => {
            const addon = prices.addons[index];
            const price = isYearly ? addon.yearly : addon.monthly;
            addonsTotal += price;

            const div = document.createElement('div');
            div.className = 'd-flex align-items-center justify-content-between mb-2';
            div.innerHTML = `
                <h6 class="opacity-50 m-0 fw-regular fs-200">${addon.name}</h6>
                <span class="clr-blue-950 fs-100">+$${price}/${periodShort}</span>
            `;
            summaryAddonsContainer.appendChild(div);
        });
    }

    const total = selectedPlan.price + addonsTotal;
    summaryTotalLabel.textContent = isYearly ? 'year' : 'month';
    summaryTotalAmount.textContent = `$${total}/${periodShort}`;
  }

initForm();
selectPlan(0); 
});