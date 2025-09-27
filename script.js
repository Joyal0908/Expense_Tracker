let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("expenseForm");
const tableBody = document.querySelector("#transactionTable tbody");

const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const totalBalanceEl = document.getElementById("total-balance");

// Load transactions on page load
window.addEventListener("DOMContentLoaded", () => {
    // Add loading animation
    totalBalanceEl.innerHTML = '<span class="loading"></span>';
    totalIncomeEl.innerHTML = '<span class="loading"></span>';
    totalExpenseEl.innerHTML = '<span class="loading"></span>';

    setTimeout(() => {
        transactions.forEach(t => addTransactionToTable(t));
        updateDashboard();
    }, 800);
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value;
    const type = document.getElementById("type").value;

    if (isNaN(amount) || amount <= 0) {
        showToast("Please enter a valid amount", "error");
        return;
    }

    // Create transaction object
    const transaction = {
        id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
        amount,
        description,
        type
    };

    // Add to array
    transactions.push(transaction);

    // Save to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Add row to table with animation
    addTransactionToTable(transaction);

    // Update dashboard
    updateDashboard();

    // Show success message
    showToast("Transaction added successfully!", "success");

    // Reset form
    form.reset();
});

function addTransactionToTable(transaction) {
    const row = document.createElement('tr');
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';

    row.innerHTML = `
                <td>${transaction.id}</td>
                <td>$${transaction.amount.toFixed(2)}</td>
                <td>${transaction.description}</td>
                <td class="${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
                    ${transaction.type}
                </td>
            `;

    tableBody.appendChild(row);

    // Animate the new row
    setTimeout(() => {
        row.style.transition = 'all 0.5s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateX(0)';
    }, 10);
}

function updateDashboard() {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }
    });

    const balance = income - expense;

    // Animate the numbers
    animateValue(totalIncomeEl, 0, income, 800, '$');
    animateValue(totalExpenseEl, 0, expense, 800, '$');
    animateValue(totalBalanceEl, 0, balance, 800, '$');

    // Add pulse animation to balance card if balance is positive
    const balanceCard = document.getElementById('total-balance-card');
    if (balance > 0) {
        balanceCard.classList.add('animate-pulse');
    } else {
        balanceCard.classList.remove('animate-pulse');
    }
}

// Function to animate number counting up
function animateValue(element, start, end, duration, prefix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = prefix + value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Toast notification function
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast p-3';
    toast.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2"></i>
                    <span>${message}</span>
                </div>
            `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'all 0.5s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 3000);
}