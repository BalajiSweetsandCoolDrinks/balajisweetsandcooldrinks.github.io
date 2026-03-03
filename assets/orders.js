/**
 * Order Management System
 * Stores and manages orders locally using localStorage
 * Integrates with cart.js for order placement
 */

const ORDERS_KEY = 'bs_orders_v1';

/**
 * Create a new order from cart
 */
function createOrder(customerData) {
    const cart = loadCart();
    
    if (cart.length === 0) {
        console.error('Cart is empty');
        return null;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const order = {
        id: Date.now() + '' + Math.floor(Math.random() * 10000),
        customerName: customerData.name || 'Guest',
        customerPhone: customerData.phone || '',
        customerAddress: customerData.address || '',
        items: cart.map(item => ({
            id: item.id,
            name: item.title || item.name || 'Unknown Item',
            weight: item.weight || '',
            qty: item.qty,
            price: item.price
        })),
        total: total,
        status: 'pending', // pending, confirmed, completed, cancelled
        paymentStatus: 'awaiting', // awaiting, paid
        notes: '',
        date: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };

    // Save order
    const orders = getAllOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Clear cart after order
    clearCart();

    return order;
}

/**
 * Get all orders
 */
function getAllOrders() {
    try {
        const orders = localStorage.getItem(ORDERS_KEY);
        return orders ? JSON.parse(orders) : [];
    } catch (e) {
        console.error('Error loading orders:', e);
        return [];
    }
}

/**
 * Get order by ID
 */
function getOrderById(orderId) {
    const orders = getAllOrders();
    return orders.find(o => o.id === orderId) || null;
}

/**
 * Get orders by status
 */
function getOrdersByStatus(status) {
    const orders = getAllOrders();
    return orders.filter(o => o.status === status);
}

/**
 * Get orders by customer phone
 */
function getOrdersByPhone(phone) {
    const orders = getAllOrders();
    return orders.filter(o => o.customerPhone === phone);
}

/**
 * Update order status and notes
 */
function updateOrder(orderId, updates) {
    const orders = getAllOrders();
    const index = orders.findIndex(o => o.id === orderId);

    if (index === -1) {
        console.error('Order not found');
        return false;
    }

    orders[index] = {
        ...orders[index],
        ...updates,
        lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return true;
}

/**
 * Remove order
 */
function removeOrder(orderId) {
    const orders = getAllOrders();
    const filtered = orders.filter(o => o.id !== orderId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(filtered));
    return true;
}

/**
 * Clear all orders
 */
function clearOrders() {
    localStorage.removeItem(ORDERS_KEY);
    return true;
}

/**
 * Get order statistics
 */
function getOrderStats() {
    const orders = getAllOrders();
    
    return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0
    };
}

/**
 * Get recent orders (last N)
 */
function getRecentOrders(limit = 10) {
    const orders = getAllOrders();
    return orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
}

/**
 * Send order to WhatsApp for confirmation (helper)
 * This creates a WhatsApp message with order details
 */
function getOrderWhatsAppMessage(orderId) {
    const order = getOrderById(orderId);
    if (!order) return null;

    const itemsList = order.items.map(item => `• ${item.name} (${item.qty})`).join('\n');
    
    const message = `
Hi ${order.customerName}! 👋

Your order has been received! 📋

*Order Details:*
Order ID: ${order.id}
Date: ${new Date(order.date).toLocaleDateString()}

*Items:*
${itemsList}

*Total: ₹${order.total.toFixed(2)}*

*Delivery Address:*
${order.customerAddress}

We will confirm your order shortly. Thank you! 🙏

Balaji Sweets
    `.trim();

    return message;
}

/**
 * Export orders to JSON
 */
function exportOrdersJSON() {
    const orders = getAllOrders();
    const dataStr = JSON.stringify(orders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

/**
 * Import orders from JSON backup
 */
function importOrdersJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const orders = JSON.parse(e.target.result);
                if (Array.isArray(orders)) {
                    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
                    resolve(orders);
                } else {
                    reject('Invalid order format');
                }
            } catch (error) {
                reject('Error parsing JSON: ' + error.message);
            }
        };
        reader.onerror = () => reject('Error reading file');
        reader.readAsText(file);
    });
}

// Auto-save sample order for demo (uncomment to test)
/*
if (getAllOrders().length === 0) {
    const sampleOrder = {
        id: 'ORD-SAMPLE-001',
        customerName: 'Rajesh Kumar',
        customerPhone: '919876543210',
        customerAddress: '123 Main Street, Piduguralla, AP 522413',
        items: [
            { id: 'kaju-1', name: 'Kaju Katli', qty: 500, price: 1 },
            { id: 'ladoo-1', name: 'Motichoor Ladoo', qty: 500, price: 0.4 }
        ],
        total: 700,
        status: 'pending',
        notes: '',
        date: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    const orders = [sampleOrder];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
*/
