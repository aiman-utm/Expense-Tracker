const expenseForm = document.getElementById('expense-form');
const expensesList = document.getElementById('expenses-list');
const totalExpenses = document.getElementById('total-expenses');

let expenses = [];

function showExpenseForm(){
  document.getElementById("add-new-expense-btn").style.display = "none";
  document.getElementById("daily-expense-form").style.display = "block";
}

function cancelExpenseForm(){
  document.getElementById("add-new-expense-btn").style.display = "block";
  document.getElementById("daily-expense-form").style.display = "none";
}

document.getElementById('daily-expense-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const amountInput = document.getElementById('amount');
  const amount = parseFloat(amountInput.value);
  const date = document.getElementById('date').value;

  if (isNaN(amount) || amountInput.value.trim() === '') {
    amountInput.classList.add('is-invalid');
    amountInput.focus();
    return;
  }

  amountInput.classList.remove('is-invalid');

  expenses.push({ title, amount, date });

  document.getElementById('title').value = '';
  amountInput.value = '';
  document.getElementById('date').value = '';

  updateExpensesList();
  updateChart();
});

document.getElementById('filter-year').addEventListener('change', function() {
  updateExpensesList();
  updateChart();
});

function updateExpensesList() {
  const filterYear = document.getElementById('filter-year').value;

  const filteredExpenses = filterYear ? expenses.filter(expense => expense.date.startsWith(filterYear)) : expenses;

  let listHTML = '';
  if (filteredExpenses.length > 0) {
    filteredExpenses.forEach(expense => {
    const [year, month, day] = expense.date.split('-');
    const monthName = getMonthName(month);
    listHTML += '<div class="expense-item d-flex justify-content-between">';
    listHTML += `<div class="date text-center mx-2 my-2 h-25"><span class="month">${monthName}</span><br><span class="year">${year}</span><br><span class="day p-2">${day}</span></div>`;
    listHTML += `<div class="title p-4 mt-1">${expense.title}</div>`;
    listHTML += `<div class="amount text-center p-2 my-4 h-25">$${expense.amount.toFixed(2)}</div>`;
    listHTML += '</div><br>';
    });
  } else {
      listHTML = '<p class="no-expenses text-center mt-4">Found no expenses.</p>';
  }

  document.getElementById('expenses-list').innerHTML = listHTML;
}

function updateChart() {
  const filterYear = document.getElementById('filter-year').value;

  const filteredExpenses = filterYear ? expenses.filter(expense => expense.date.startsWith(filterYear)) : expenses;

  const monthlyTotals = Array.from({ length: 12 }, () => 0);
  filteredExpenses.forEach(expense => {
    const [year, month] = expense.date.split('-');
    const index = parseInt(month, 10) - 1;
    monthlyTotals[index] += expense.amount;
  });

  if (window.myChart) {
    window.myChart.destroy();
  }

  const ctx = document.getElementById('expenses-chart').getContext('2d');
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: getMonthLabels(),
      datasets: [{
        label: 'Monthly Expenses',
        data: monthlyTotals,
        borderRadius: Number.MAX_VALUE,
        backgroundColor: 'rgba(107, 76, 193, 0.5)',
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true, 
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0
          },
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function getMonthLabels() {
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthLabels;
}

function getMonthName(month) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[parseInt(month, 10) - 1];
}
