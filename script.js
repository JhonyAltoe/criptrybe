const cryptoList = document.getElementById('crypto-list');
const select = document.getElementById('options');
const loggedElem = document.querySelectorAll('.logged');
const notLoggedElem = document.querySelectorAll('.not-logged');

const registerElem = document.querySelector('.register');
const registerBtn = document.querySelector('#register-btn');
const registerText = document.querySelectorAll('.register-text');

const loginElem = document.querySelector('.login');
const loginBtn = document.querySelector('#login-btn');
const loginText = document.querySelector('.login-text');

const logoutText = document.querySelector('.logout-text');

const verifyBlanks = () => {
  const username = registerElem.querySelector('.username').value;
  const password = registerElem.querySelectorAll('.password');
  return (username && password[0].value && password[1].value);
}

const verifyPassword = () => {
  const passwords = registerElem.querySelectorAll('.password');
  return passwords[0].value === passwords[1].value;
}

const createUser = () => {
  if (!verifyBlanks()) {
    console.log('Fields cannot be blank');
    return;
  }
  if (!verifyPassword()) {
    console.log('Password mut match confirmation!');
    return
  }
  loginElem.style.display = 'block';
  registerElem.style.display = 'none';
  const username = registerElem.querySelector('.username').value;
  const password = registerElem.querySelector('.password').value;
  localStorage.setItem('userData', JSON.stringify({ username, password }));
}

const loginLogout = (block, none) => {
  block.forEach((e) => e.style.display = 'block');
  none.forEach((e) => e.style.display = 'none');
}

const loginRegister = (block, none) => {
  block.style.display = 'block';
  none.style.display = 'none';
}

const login = () => {
  const user = loginElem.querySelector('.username').value;
  const pwd = loginElem.querySelector('.password').value;
  const { username, password } = JSON.parse(localStorage.getItem('userData'));
  if(user === username && pwd === password) {
    document.querySelector('.user-text').innerHTML = `Bem-vindo(a), <span>${JSON.parse(localStorage.getItem('userData')).username}</span>!`;
    loginLogout(loggedElem, notLoggedElem);
  }
}

const createElement = (tag, ...classNames) => {
  const e = document.createElement(tag);
  if (!classNames.length) return e;
  e.className = classNames.join(' ');
  return e;
}

const listListener = (event) => {
  const targetId = event.target.dataset.symbol;
  const optionsChildren = Array.from(select.children);
  const toRemove = optionsChildren.find((child) => child.hasAttribute('selected'));
  if (toRemove) toRemove.removeAttribute('selected');
  select.querySelector(`.${targetId}`).setAttribute('selected', '');
}

const listCrypto = async () => {
  const carregando = createElement('div', 'carregando');
  carregando.innerText = 'Carregando...';
  cryptoList.appendChild(carregando);
  const list = await fetchCryptoList();
  document.querySelector('.carregando').remove();
  list.forEach(({ symbol, price }) => {
    const text = `<span data-symbol="${symbol}">${symbol.substring(0, symbol.length - 3)}</span> ${parseFloat(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    const li = createElement('li', 'item-list');
    li.innerHTML = text;
    li.dataset.symbol = symbol;
    li.addEventListener('click', listListener);
    cryptoList.appendChild(li);
  });
}

async function cryptOptions () {
  const list = await fetchCryptoList();
  list.forEach(({ symbol }) => {
    const option = createElement('option', symbol);
    option.value = symbol.substring(0, symbol.length - 3);
    option.innerText = symbol.substring(0, symbol.length - 3);
    select.appendChild(option);
  });
}

window.onload = async () => {
  loginLogout(notLoggedElem, loggedElem);
  loginRegister(registerElem, loginElem);
  registerText.forEach((e) => e.addEventListener('click', () => loginRegister(registerElem, loginElem)));
  loginText.addEventListener('click', () => loginRegister(loginElem, registerElem));
  logoutText.addEventListener('click', () => {
    loginLogout(notLoggedElem, loggedElem);
    loginRegister(loginElem, registerElem);
  });
  registerBtn.addEventListener('click', createUser);
  loginBtn.addEventListener('click', login);
  await listCrypto();
  cryptOptions();
}