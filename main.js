let people = JSON.parse(localStorage.getItem('gs_people')||'[]');
let items = JSON.parse(localStorage.getItem('gs_items')||'[]');

function save() {
  localStorage.setItem('gs_people', JSON.stringify(people));
  localStorage.setItem('gs_items', JSON.stringify(items));
}

function addPerson() {
  const input = document.getElementById('personInput');
  const name = input.value.trim();
  if (name && !people.includes(name)) {
    people.push(name);
    input.value = '';
    save();
    renderPeople();
    renderPayerOptions();
  }
}
function delPerson(name) {
  people = people.filter(p => p !== name);
  items = items.filter(it => it.payer !== name);
  save();
  renderPeople();
  renderPayerOptions();
  renderItems();
}

function renderPeople() {
  document.getElementById('people').innerHTML =
    people.map(p => `<span class="person">${p} <button onclick="delPerson('${p}')">x</button></span>`).join('');
}

function renderPayerOptions() {
  const sel = document.getElementById('itemPayer');
  sel.innerHTML = `<option value="">Paid by...</option>` + people.map(p => `<option>${p}</option>`).join('');
}

function addItem() {
  const name = document.getElementById('itemName').value.trim();
  const price = parseFloat(document.getElementById('itemPrice').value);
  const payer = document.getElementById('itemPayer').value;
  if (name && price && payer) {
    items.push({name, price, payer});
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemPayer').value = '';
    save();
    renderItems();
  }
}
function delItem(i) {
  items.splice(i, 1);
  save();
  renderItems();
}

function renderItems() {
  document.getElementById('items').innerHTML = items.map((it,i) =>
    `<div class="item">${it.name} - €${it.price.toFixed(2)} <small>(paid by ${it.payer})</small> <button onclick="delItem(${i})">x</button></div>`
  ).join('');
}

function calculate() {
  let totals = Object.fromEntries(people.map(p=>[p,0]));
  let paid = Object.fromEntries(people.map(p=>[p,0]));
  items.forEach(it => {
    totals[it.payer] += it.price;
    let split = it.price / people.length;
    people.forEach(p => paid[p] += split);
  });
  let result = people.map(p => `${p}: ${totals[p] - paid[p] > 0 ? 'should receive' : 'should pay'} €${Math.abs(totals[p]-paid[p]).toFixed(2)}`).join('<br>');
  document.getElementById('result').innerHTML = result;
}

window.onload = () => {
  renderPeople();
  renderPayerOptions();
  renderItems();
};
