// script.js

// Sample Malaysian barcode to price mapping (EAN-13)
const barcodeData = {
    "9556623000022": { name: "baby powder", price: 14.50 },
    "9555430810053": { name: "nail lacquer", price: 22.75 },
    "8887603539364": { name: "guardian clear assorted plasters", price: 3.70 },
    "4899988776655": { name: "Granulated Sugar", price: 3.25 },
    "4895544332211": { name: "Teh Petaling", price: 5.00 },
    // Add more Malaysian items as needed
};

let cart = [];

// DOM Elements
const startScanBtn = document.getElementById('start-scan');
const stopScanBtn = document.getElementById('stop-scan');
const scanner = document.getElementById('scanner');
const readerDiv = document.getElementById('reader');
const barcodeInput = document.getElementById('barcode-input');
const addBarcodeBtn = document.getElementById('add-barcode');
const cartItems = document.getElementById('cart-items');
const totalElement = document.getElementById('total');

let html5QrCode; // Html5 QR Code instance

// Initialize Html5 QR Code
function startScanner() {
    scanner.classList.remove('hidden');
    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: 250 };

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
            console.log(`Barcode detected: ${decodedText}`, decodedResult);
            alert(`Barcode detected: ${decodedText}`);
            addItem(decodedText);
            stopScanner();
        },
        (errorMessage) => {
            // Scan error, ignore it.
            console.warn(`Scan error: ${errorMessage}`);
        }
    ).catch((err) => {
        console.error("Unable to start scanning:", err);
        alert("Unable to start scanning. Please try again.");
    });
}

function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            console.log("Html5 QR Code scanner stopped.");
        }).catch((err) => {
            console.error("Error stopping scanner:", err);
        });
    }
    scanner.classList.add('hidden');
}

// Add item to cart
function addItem(barcode) {
    if (barcodeData[barcode]) {
        cart.push(barcodeData[barcode]);
        renderCart();
    } else {
        alert("Item not found for the scanned barcode.");
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
        tdPrice.textContent = `RM ${item.price.toFixed(2)}`;
        tr.appendChild(tdPrice);

        const tdAction = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";
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
    // Request camera permission and start scanner
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            console.log("Camera permission granted.");
            startScanner();
        })
        .catch((err) => {
            console.error("Camera permission denied or error:", err);
            alert("Camera permission denied or cannot be accessed.");
        });
});

stopScanBtn.addEventListener('click', stopScanner);

addBarcodeBtn.addEventListener('click', () => {
    const barcode = barcodeInput.value.trim();
    if (barcode) {
        addItem(barcode);
        barcodeInput.value = '';
    } else {
        alert("Please enter a barcode.");
    }
});

// Initial render
renderCart();
