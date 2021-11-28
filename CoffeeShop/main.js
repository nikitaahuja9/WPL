<script>
const addToCart = (username, id, quantity, maxquantity, name, price) => {
    let cartContent = localStorage.getItem("cart")
    if (cartContent) {
        cartContent = JSON.parse(cartContent)
        if (cartContent && cartContent.username == username) {
            const orders  = cartContent.orders
            let foundIndex = orders.findIndex(x => x.id == id);
            if (foundIndex != -1) {
                orders[foundIndex].quantity = quantity
                orders[foundIndex].maxquantity = maxquantity
                orders[foundIndex].name = name
                orders[foundIndex].price = price
            } else {
                orders.push({
                    id,
                    quantity,
                    maxquantity,
                    name,
                    price
                })
            }
            localStorage.setItem("cart", JSON.stringify(cartContent))
        } else {
            localStorage.removeItem("cart");
            const cartContent = {
                username: username,
                orders: [{
                    id,
                    quantity,
                    maxquantity,
                    name,
                    price
                }]
            }
            localStorage.setItem("cart", JSON.stringify(cartContent))
        }
    } else {
        const cartContent = {
            username: username,
            orders: [{
                id,
                quantity,
                maxquantity,
                name,
                price
            }]
        }
        localStorage.setItem("cart", JSON.stringify(cartContent))
    }
}
</script>