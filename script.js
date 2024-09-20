// script.js

// Sample Malaysian barcode to price mapping (EAN-13)
const barcodeData = {
    "9556623000022": { name: "baby powder", price: 4.50 },    // Example: Fresh Milk
    "4890987654321": { name: "Roti Tawar", price: 2.75 },    // Example: White Bread
    "4891122334455": { name: "Minyak Masak", price: 8.00 },   // Example: Cooking Oil
    "4899988776655": { name: "Gula Pasir", price: 3.25 },     // Example: Granulated Sugar
    "4895544332211": { name: "Teh Petaling", price: 5.00 },   // Example: Teh (Tea)
    // Add more Malaysian items as needed
};

let cart = [];

// DOM Elements
const startScanBtn = document.getElementById('start-scan');
const stopScanBtn = document.getElementById('stop-scan');
const scanner = document.getElementById('scanner');
const video = document.getElementById('video');
const barcodeInput = document.getElementById('barcode-input');
const addBarcodeBtn = document.getElementById('add-barcode');
const cartItems = document.getElementById('cart-items');
const totalElement = document.getElementById('total');

// Initialize Quagga
function startScanner() {
    scanner.classList.remove('hidden');
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            constraints: {
                facingMode: "environment" // Use back camera
            },
            target: video // Or '#yourElement' (optional)
        },
        decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader"]
        }
    }, function(err) {
        if (err) {
            console.error(err);
            alert("Ralat memulakan imbasan. Sila cuba lagi.");
            scanner.classList.add('hidden');
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(onDetected);
}

function stopScanner() {
    Quagga.offDetected(onDetected);
    Quagga.stop();
    scanner.classList.add('hidden');
}

function onDetected(result) {
    const code = result.codeResult.code;
    // Prevent multiple detections
    Quagga.offDetected(onDetected);
    alert(`Kod Bar dikesan: ${code}`);
    addItem(code);
    stopScanner();
}

// Add item to cart
function addItem(barcode) {
    if (barcodeData[barcode]) {
        cart.push(barcodeData[barcode]);
        renderCart();
    } else {
        alert("Item tidak dijumpai untuk kod bar yang diimbas.");
    }
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = item.name;
        tr.appendChild(tdName);

        const tdPrice = document.createElement('td');
        tdPrice.textContent = item.price.toFixed(2);
        tr.appendChild(tdPrice);

        const tdAction = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Buang";
        removeBtn.classList.add('action-btn');
        removeBtn.addEventListener('click', () => {
            cart.splice(index, 1);
            renderCart();
        });
        tdAction.appendChild(removeBtn);
        tr.appendChild(tdAction);

        cartItems.appendChild(tr);
    });

    totalElement.textContent = total.toFixed(2);
}

// Event Listeners
startScanBtn.addEventListener('click', () => {
    // Request camera permission
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
            startScanner();
        })
        .catch(err => {
            console.error(err);
            alert("Kebenaran kamera ditolak.");
        });
});

stopScanBtn.addEventListener('click', stopScanner);

addBarcodeBtn.addEventListener('click', () => {
    const barcode = barcodeInput.value.trim();
    if (barcode) {
        addItem(barcode);
        barcodeInput.value = '';
    } else {
        alert("Sila masukkan kod bar.");
    }
});

// Initial render
renderCart();
