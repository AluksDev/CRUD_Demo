let manager;
let lastIdProduct;
let lastIdClient;
let lastIdOrder;



// Estas funcionciones rellenan dato sin necesidad de ponerlo a mano --- Hecho con GPT
function createMockDataV2() {
    // Clear current data
    manager = new CollectionManager();
    lastIdProduct = 0;
    lastIdClient = 0;
    lastIdOrder = 0;

    // Add Zones
    const zones = [
        new Zone("Central", 1.0),
        new Zone("North-East", 1.15),
        new Zone("West-End", 1.05),
        new Zone("Harbor District", 1.25)
    ];
    zones.forEach(zone => manager.addElement("zones", zone));

    // Add Products
    const productNames = [
        "Gaming Mouse", "Portable Power Bank", "4K Action Camera", "Wireless Earbuds",
        "Smart Thermostat", "Ergonomic Chair", "Desk Lamp", "Fitness Tracker",
        "Mini Projector", "USB Microphone"
    ];

    productNames.forEach((name, i) => {
        const price = (Math.random() * 80 + 30).toFixed(2); // $30 - $110
        const stock = Math.floor(Math.random() * 80) + 10;  // 10 - 90
        manager.addElement("products", new Product(lastIdProduct++, name, parseFloat(price), stock));
    });

    // Add Clients
    const clientData = [
        { name: "Noah Bennett", email: "noah.bennett@example.com" },
        { name: "Sophia Martinez", email: "sophia.martinez@example.com" },
        { name: "Liam O'Connor", email: "liam.oconnor@example.com" },
        { name: "Maya Singh", email: "maya.singh@example.com" },
        { name: "Ethan White", email: "ethan.white@example.com" }
    ];

    clientData.forEach((client, i) => {
        const zone = zones[Math.floor(Math.random() * zones.length)];
        const address = `Street ${i + 10}, Building ${Math.floor(Math.random() * 50 + 1)}`;
        manager.addElement("clients", new Client(lastIdClient++, client.name, client.email, address, zone));
    });

    // Add Orders
    for (let i = 0; i < 12; i++) {
        const client = manager.clients[Math.floor(Math.random() * manager.clients.length)];
        const productEntries = getRandomProductsWithQuantities(manager.products, 2);
        const total = productEntries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const date = randomDateThisYear2025();
        manager.addElement("orders", new Order(lastIdOrder++, client, date, productEntries, total));
    }

    manager.saveToLocalStorage();
    printZonesTable();
    printProductsTable();
    printOrdersTable();
    printClients();
}
function getRandomProductsWithQuantities(products, n) {
    const shuffled = [...products].sort(() => 0.5 - Math.random()).slice(0, n);
    return shuffled.map(product => ({
        product: product,
        quantity: Math.floor(Math.random() * 5) + 1 // 1 to 5
    }));
}

// Helper: Pick n random products
function getRandomProducts(products, n) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

// Helper: Random date in current month
function randomDateThisYear2025() {
    const month = Math.floor(Math.random() * 12); // Random month from 0 (Jan) to 11 (Dec)
    const day = Math.floor(Math.random() * 28) + 1; // Random day from 1 to 28
    return new Date(2025, month, day).toISOString().split("T")[0]; // "YYYY-MM-DD"
}





//Declaración clases
class Product {
    constructor(id, name, price, stock) {
        this.id = id;
        this.name = name;
        this.price = price.toFixed(2);
        this.stock = stock;
    }
}

class Client {
    constructor(id, name, email, address, zone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.zone = zone;
    }
}

class Order {
    constructor(id, client, date, products, total) {
        this.id = id;
        this.client = client;
        this.date = date;
        this.products = products;
        this.total = total;
    }
}

class Zone {
    constructor(name, rate) {
        this.name = name;
        this.rate = parseFloat(rate);
    }
}

//Esta clase es un contenedor general donde guardar los varios datos del programa
class CollectionManager {
    constructor() {
        this.products = [];
        this.clients = [];
        this.orders = [];
        this.zones = [];
    }
    saveToLocalStorage() {
        localStorage.setItem('collectionManager', JSON.stringify(this));
        localStorage.setItem('lastIdProduct', JSON.stringify(lastIdProduct));
        localStorage.setItem('lastIdClient', JSON.stringify(lastIdClient));
        localStorage.setItem('lastIdOrder', JSON.stringify(lastIdOrder));
    }
    addElement(collectionName, element) {
        this[collectionName].push(element);
    }
    removeElement(collectionName, id) {
        this[collectionName] = this[collectionName].filter(product => product.id !== id);
    }
    updateProduct(id, name, price, stock) {
        for (let product of this.products) {
            if (product.id == id) {
                product.name = name;
                product.price = price;
                product.stock = stock;
            }
        }
    }
    findElement(id, collectionName) {
        let foundElement = _.find(this[collectionName], { id: parseInt(id) });
        if (foundElement != undefined)
            return foundElement;
        else
            return 'Not Found'
    }
}

window.onload = function () {
    if (localStorage.getItem('collectionManager')) {
        manager = JSON.parse(localStorage.getItem('collectionManager'));
        Object.setPrototypeOf(manager, CollectionManager.prototype);
        lastIdProduct = JSON.parse(localStorage.getItem('lastIdProduct'));
        lastIdClient = JSON.parse(localStorage.getItem('lastIdClient'));
        lastIdOrder = JSON.parse(localStorage.getItem('lastIdOrder'));
        recentOrdersTable();
        getTopProducts();
        getZonesRevenue();
    } else {
        manager = new CollectionManager();
        lastIdProduct = 0;
        lastIdClient = 0;
        lastIdOrder = 0;
    }
    printZonesTable();
    printProductsTable();
    printOrdersTable();
    printClients();
    ordersStatistics();
}
//Función para pintar la tabla de los pedidos
function printOrdersTable() {
    document.getElementById('orders-table-body').innerHTML = '';
    for (let order of manager.orders) {
        document.getElementById('orders-table-body').innerHTML += `<tr>
                                                                    <td>${order.id}</td>
                                                                    <td>${order.client.name}</td>
                                                                    <td>[${order.products.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}]</td>
                                                                    <td>${order.total.toFixed(2)} €</td>
                                                                </tr>`;
    }
}

//Función para pintar la tabla de las zonas
function printZonesTable() {
    document.getElementById('zones-table-body').innerHTML = '';
    document.getElementById('newClientZoneSelect').innerHTML = '<option selected disabled>-- Select Zone --</option>';
    let orderPerZonePerDay = {};
    manager.zones.forEach(zone => {
        orderPerZonePerDay[zone.name] = [0, 0, 0, 0, 0, 0, 0];
    });
    manager.orders.forEach(order => {                           //Esta parte del codigo mira cuantos pedidos hay en cada zona cada día de la semana
        const date = new Date(order.date);
        const dayOfWeek = date.getDay();
        const zoneName = order.client.zone.name;
        orderPerZonePerDay[zoneName][dayOfWeek]++;
    });

    for (let zone of manager.zones) {
        document.getElementById('zones-table-body').innerHTML += `<tr>
                                                                    <td>${zone.name}</td>
                                                                    <td>${zone.rate} %</td>
                                                                    <td>[${orderPerZonePerDay[zone.name]}]</td>
                                                                </tr>`;
        let option = document.createElement('option');                               //Aquí añadimos las zonas al select del formulario para crear un nuevo cliente
        option.setAttribute('value', zone.name);
        option.innerHTML = zone.name;
        document.getElementById('newClientZoneSelect').appendChild(option);
    }
    getZonesRevenue();
}

//Función para pintar la tabla de los productos
function printProductsTable() {
    document.getElementById('products-table-body').innerHTML = '';
    document.getElementById('productNewOrderSelectElement').innerHTML = '<option disabled selected>-- Select Product --</option>';
    for (let product of manager.products) {
        document.getElementById('products-table-body').innerHTML += `<tr>
                                                                    <td>${product.id}</td>
                                                                    <td>${product.name}</td>
                                                                    <td>${product.price} €</td>
                                                                    <td>${product.stock}</td>
                                                                </tr>`;
        let option = document.createElement('option');                  //Aquí añadimos los productos al select en el formulario que crea un nuevo pedido
        option.setAttribute('value', product.id);
        option.innerHTML = product.name;
        document.getElementById('productNewOrderSelectElement').appendChild(option);
    }
}

//Función para añadir los clientes disponibles al select del formulario que crea un nuevo pedido
function printClients() {
    document.getElementById('clientSelectElement').innerHTML = '<option disabled selected>-- Select Client --</option>';
    for (let client of manager.clients) {
        let option = document.createElement('option');
        option.setAttribute('value', client.id);
        option.innerHTML = 'Client Name: ' + client.name;
        document.getElementById('clientSelectElement').appendChild(option);
    }
}

//Coge el value de un input y utilizando el metodo findElement() presente en la clase CollectionManager, busca un ID en una de las colecciónes
function searchElement(collection) {
    let idToFind = 0;
    switch (collection) {
        case 'products':
            idToFind = document.getElementById(`find_${collection}Input`).value;
            break;
        case 'clients':
            idToFind = document.getElementById(`find_${collection}Input`).value;
            break;
        case 'orders':
            idToFind = document.getElementById(`find_${collection}Input`).value;
            break;
    }
    fillDetailsModal(manager.findElement(idToFind, collection), collection);
    document.getElementById(`find_${collection}Input`).value = '';
}

//Crea una estructura visual jerárquica para cuando se busca un elemento
function formatObject(obj, indent = 0) {
    let result = '';
    const prefix = '-'.repeat(indent * 4);

    for (let key in obj) {
        if (typeof obj[key] !== 'object' || obj[key] === null) {
            result += `<strong>${prefix}${key}</strong>: ${obj[key]}<br>`;
        } else {
            result += `<strong>${prefix}${key}</strong>:<br>`;
            result += formatObject(obj[key], indent + 1);
        }
    }

    return result;
}

//Pinta la ventana que se visualiza cuando se busca un elemento, utilizando el formato de la función de antes
function fillDetailsModal(object, collection) {
    let modalBody = '';
    let objectId = null;
    for (let key in object) {
        if (key == 'id') {
            objectId = object[key];
        }
    }
    if (object != 'Not Found') {
        modalBody = `<div class="modal-body text-start">
                        ${formatObject(object)}
                    </div>`;
    } else {
        modalBody = `<div class="modal-body text-start">
                        Element Not Found
                    </div>`;
    }
    document.getElementById('detailsModal').innerHTML = `<div class="modal-dialog">
                                <div class="modal-content">
                                    ${modalBody}
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-danger"
                                            data-bs-dismiss="modal" onclick="deleteElement('${collection}', ${objectId})">Delete</button>
                                        <button type="button" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>`
}

//Borra un elemento de una colección con el metodo removeElement() y pinta todas las tablas
function deleteElement(collection, id) {
    manager.removeElement(collection, id);
    manager.saveToLocalStorage();
    printOrdersTable();
    printZonesTable();
    printProductsTable();
    printClients();
    ordersStatistics();
    recentOrdersTable();
    getTopProducts();
    getZonesRevenue();
}

//Muestra una ventana flotante cuando se añade, borra, o cambia un producto, o añadimos un nuevo cliente
function showFloatingWindow(action) {
    document.getElementById('floating-background').style.display = 'block';
    switch (action) {
        case 'add':
            document.getElementById('addProduct-inner-floating').style.display = 'block';
            break;
        case 'remove':
            document.getElementById('removeProduct-inner-floating').style.display = 'block';
            break;
        case 'update':
            document.getElementById('updateProduct-inner-floating').style.display = 'block';
            for (let product of manager.products) {
                let option = document.createElement('option');
                option.setAttribute('value', product.id);
                option.innerHTML = product.name;
                document.getElementById('selectElement').appendChild(option);
            }
            break;
        case 'newClient':
            document.getElementById('newClient-inner-floating').style.display = 'block';
            break;
    }
}

//Esconde todas las ventanas flotantes
function hideFloatingWindows() {
    document.getElementById('floating-background').style.display = 'none';
    document.getElementById('addProduct-inner-floating').style.display = 'none';
    document.getElementById('removeProduct-inner-floating').style.display = 'none';
    document.getElementById('updateProduct-inner-floating').style.display = 'none';
    document.getElementById('update-div').style.display = 'none';
    document.getElementById('newClient-inner-floating').style.display = 'none';
}

document.getElementById('add-product-form').addEventListener('submit', addProduct);
//Coge los datos del formulario y crea un nuevo producto
function addProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let name = formData.get('productNameInput');
    let price = formData.get('priceInput');
    let stock = formData.get('stockInput');
    manager.addElement('products', new Product(lastIdProduct, name, parseFloat(price), parseInt(stock)));
    manager.saveToLocalStorage();
    document.getElementById('add-product-form').reset();
    printProductsTable();
    hideFloatingWindows();
    lastIdProduct++;
}

document.getElementById('remove-product-form').addEventListener('submit', removeProduct);

function removeProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let id = formData.get('idInput');
    manager.removeElement('products', parseInt(id));
    manager.saveToLocalStorage();
    document.getElementById('remove-product-form').reset();
    printProductsTable();
    hideFloatingWindows()
}
//Abre una ventana flotante y rellena los inputs con el ID del producto seleccionado
function showUpdateProductWindow(id) {
    let productToChange = null;
    for (let product of manager.products) {
        if (product.id == id) {
            productToChange = product;
        }
    }
    document.getElementById('update-div').style.display = 'block';
    document.getElementById('updateNameInput').value = productToChange.name;
    document.getElementById('updatePriceInput').value = productToChange.price;
    document.getElementById('updateStockInput').value = productToChange.stock;
    document.getElementById('update-product-form').addEventListener('submit', function (e) {
        updateProduct(e, id);
    });
}
//Coge los datos del formulario y modifica un producto
function updateProduct(e, id) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let name = formData.get('productNameInput');
    let price = formData.get('priceInput');
    let stock = formData.get('stockInput');
    manager.updateProduct(id, name, price, stock);
    document.getElementById('update-product-form').reset();
    manager.saveToLocalStorage();
    printProductsTable();
    hideFloatingWindows();
}

let newClientzone = 0;
document.getElementById('add-client-form').addEventListener('submit', newClient);
document.getElementById('newClientZoneSelect').addEventListener('change', function (e) {   //Aquí asignamo a la variable newClientZone una de las zonas disponibles para luego crear un nuovo cliente
    for (let zone of manager.zones) {
        if (zone.name == this.value) {
            newClientzone = zone;
        }
    }
})
//Coge los datos del formulario y crea un nuevo cliente
function newClient(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let clientName = formData.get('ClientNameInput');
    let clientEmail = formData.get('emailInput');
    let clientAddress = formData.get('addressInput');
    manager.addElement('clients', new Client(lastIdClient, clientName, clientEmail, clientAddress, newClientzone));
    manager.saveToLocalStorage();
    document.getElementById('add-client-form').reset();
    printClients();
    hideFloatingWindows();
    lastIdClient++;
}
//Esta función se llama cuando seleccionamo un cliente en el select. Rellena el formulario con los datos del cliente.
let selectedClient = {};
function getClientDataForOrder(clientId) {
    document.getElementById('selectedClientDiv').style.display = 'block';
    for (let client of manager.clients) {
        if (client.id == clientId) {
            selectedClient = client;
            document.getElementById('selectedClientId').value = client.id;
            document.getElementById('selectedClientName').value = client.name;
            document.getElementById('selectedClientEmail').value = client.email;
            document.getElementById('selectedClientAddress').value = client.address;
        }
    }
    selectedProduct = {};                                                           //Aquí vaciamos los productos seleccionado cuando cambiamo cliente
    document.getElementById('productNewOrderSelectElement').selectedIndex = 0;
    totalOrderPrice = 0;
    productsToOrder = [];
    document.getElementById('productsOrderPrice').value = '';
    document.getElementById('rateOrderPrice').value = '';
    document.getElementById('totalOrderPrice').value = '';
    document.getElementById('productsOrderSummary').innerHTML = '';
}

let selectedProduct = {};
function getProductDataForOrder(productId) {
    for (let product of manager.products) {
        if (product.id == productId) {
            selectedProduct = product;
        }
    }
}
//Añadimos los productos seleccionado para un nuevo pedido, incluyendo la cantidad. Y se muestra el precio total del pedido
let totalOrderPrice = 0;
let produtsOrderPrice = 0;
let productsToOrder = [];
function addProductToOrder() {
    if (Object.keys(selectedProduct).length != 0 && Object.keys(selectedClient).length != 0) {
        let quantity = parseInt(document.getElementById('productQuantity').value);
        if (!Number.isNaN(quantity) && quantity <= selectedProduct.stock) {
            document.getElementById('productsOrderSummary').innerHTML += `${selectedProduct.name} - x${quantity} <br>`;
            productsToOrder.push({
                product: selectedProduct,
                quantity: quantity
            });
            produtsOrderPrice += selectedProduct.price * quantity;
            totalOrderPrice = produtsOrderPrice * (1 + selectedClient.zone.rate / 100);
            document.getElementById('productsOrderPrice').value = produtsOrderPrice.toFixed(2);
            document.getElementById('rateOrderPrice').value = selectedClient.zone.rate.toFixed(2);
            document.getElementById('totalOrderPrice').value = totalOrderPrice.toFixed(2);
            printProductsTable();
        } else {
            if (Number.isNaN(quantity))
                alert('Add Quantity')
            else
                alert('not enought stock')
        }
    }
    document.getElementById('productQuantity').value = '';
}

document.getElementById('new-order-form').addEventListener('submit', newOrder);
let orderDate = null;
document.getElementById("orderDateInput").addEventListener("change", function () {
    orderDate = new Date(this.value).toISOString().split("T")[0];
});
//Coge los datos de las funciones de antes, creamos un nuevo pedido
function newOrder(e) {
    e.preventDefault();
    if (productsToOrder.length <= 0 || Object.keys(selectedClient).length === 0) {
        alert('Complete all form inputs')
    } else {
        for (let product of productsToOrder) {
            manager.updateProduct(product.product.id, product.product.name, product.product.price, (product.product.stock - product.quantity));
        }
        manager.addElement('orders', new Order(lastIdOrder, selectedClient, orderDate, productsToOrder, totalOrderPrice));
        manager.saveToLocalStorage();
        document.getElementById('new-order-form').reset();
        document.getElementById('selectedClientDiv').style.display = 'none';
        document.getElementById('productsOrderSummary').innerHTML = '';
        selectedProduct = {};
        totalOrderPrice = 0;
        productsToOrder = [];
        lastIdOrder++;
        printOrdersTable();
        printProductsTable();
        printZonesTable();
        ordersStatistics();
        recentOrdersTable();
        getTopProducts();
        getZonesRevenue();
    }
}

document.getElementById('new-zone-form').addEventListener('submit', addNewZone)
//Coge los datos del formulario y crea una nueva zona
function addNewZone(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let zoneName = formData.get('zoneName');
    let zoneRate = formData.get('zoneRate');
    if (zoneName == '' || zoneRate == '') {
        document.getElementById('zoneModalBody').innerHTML = 'Fill all form inputs';
    } else {
        manager.addElement('zones', new Zone(zoneName, zoneRate));
        manager.saveToLocalStorage();
        document.getElementById('zoneModalBody').innerHTML = 'Zone Added Correctly';
    }
    document.getElementById('new-zone-form').reset();
    printZonesTable();
}
//Pintamos la tabla de las estadisticas
function ordersStatistics() {
    let todayDate = new Date().toISOString().split("T")[0];
    let totalOrders = manager.orders.length;
    let shippedOrders = 0;
    let pendingOrders = 0;
    let totalRevenue = 0;
    for (let order of manager.orders) {           //Si la fecha de envio es la fecha de hoy o anterior, añadimos 1 a los pedidos enviados, si no añadimos 1 a los pedidos no enviados
        if (order.date <= todayDate) {
            shippedOrders++;
        } else {
            pendingOrders++;
        }
        totalRevenue += order.total;
    }
    document.getElementById("totalOrders").innerHTML = `Total Orders: ${totalOrders}`;
    document.getElementById("pendingOrders").innerHTML = `Pending Orders: ${pendingOrders}`;
    document.getElementById("shippedOrders").innerHTML = `Shipped Orders: ${shippedOrders}`;
    document.getElementById("totalRevenue").innerHTML = `Total Revenue: ${totalRevenue.toFixed(2)} €`;
}
//Pinta la tabla con los 5 ultimos pedidos
function recentOrdersTable() {
    tableBody = '';
    let orderStatus = '';
    for (let i = 0; i < 5; i++) {
        if (manager.orders[(manager.orders.length - 1) - i].date <= new Date().toISOString().split("T")[0]) {
            orderStatus = 'Shipped';
        } else {
            orderStatus = 'Pending';
        }
        tableBody += `<tr>
                            <th scope="row">${manager.orders[(manager.orders.length - 1) - i].id}</th>
                            <td>${manager.orders[(manager.orders.length - 1) - i].client.name}</td>
                            <td>${manager.orders[(manager.orders.length - 1) - i].total.toFixed(2)} €</td>
                            <td>${orderStatus}</td>
                        </tr>`;
    }
    document.getElementById('recentOrdersTableBody').innerHTML = tableBody;
}
//Pinta la tabla con los productos mas vendido
function getTopProducts() {
    let tableBody = '';
    let soldProducts = [];
    for (let order of manager.orders) {
        for (let product of order.products) {
            let name = product.product.name;
            let revenue = product.product.price * product.quantity;
            let existing = soldProducts.find(p => p.productName == name);
            if (existing) {
                existing.productRevenue += revenue;
                existing.numberSold++;
            } else {
                soldProducts.push({
                    productName: name,
                    numberSold: 1,
                    productRevenue: revenue
                });
            }
        }
    }
    soldProducts.sort((a, b) => b.productRevenue - a.productRevenue);
    for (let i = 0; i < 5; i++) {
        tableBody += `<tr>
                        <td>${soldProducts[i].productName}</td>
                        <td>${soldProducts[i].numberSold}</td>
                        <td>${soldProducts[i].productRevenue.toFixed(2)} €</td>
                    </tr >
        `;
    }
    document.getElementById('topProductsTableBody').innerHTML = tableBody;
}
//Pinta la tabla que muestra cual son las zonas que ganan mas dinero
function getZonesRevenue() {
    tableBody = '';
    let zonesRevenue = {};
    manager.zones.forEach((zone) => {
        zonesRevenue[zone.name] = 0;
    })
    manager.orders.forEach((order) => {
        let zoneName = order.client.zone.name;
        let orderTotal = order.total;
        zonesRevenue[zoneName] += orderTotal;
    })
    let sortedZones = _.orderBy(Object.entries(zonesRevenue), [1], ['desc']);
    for (let zone of sortedZones) {
        tableBody += `<tr>
                        <td>${zone[0]}</td>
                        <td>${zone[1].toFixed(2)} €</td>
                    </tr>`;
    }
    document.getElementById('revenueByZoneTableBody').innerHTML = tableBody;
}