import { useContext, useEffect, useState } from "react";
import { MarketContext } from "../Context/MarketContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../../assets/firebase.config";
import { updateProductInFirestore, addProductToFirestore } from "../../assets/firebaseService";

const FormInput = ({ placeholder, value, onChange, type = "text", name }) => (
    <div>
        <input
            onChange={(e) => {
                const newValue = type === "number" ? parseFloat(e.target.value) : e.target.value;
                onChange(newValue);
            }}
            type={type}
            placeholder={placeholder}
            value={value}
            name={name}
        />
    </div>
);

const FormMarket = () => {
    const {
        productName, productBrand, productPrice, market, setMarket, setProductList, setProductName,
        setProductBrand, setProductPrice, unit, setUnit, category, setCategory, stores,
        addStore, categories, addCategory, unitType, setUnitType, productQuantity, setProductQuantity,
        selectedProduct, setSelectedProduct, fetchProducts
    } = useContext(MarketContext);

    const getDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [productDate, setProductDate] = useState(getDate());
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedProduct) {
            setProductName(selectedProduct.name);
            setProductBrand(selectedProduct.brand);
            setProductPrice(selectedProduct.price);
            setMarket(selectedProduct.store);
            setUnit(selectedProduct.unit.split(" ")[0]);
            setUnitType(selectedProduct.unit.split(" ")[1]);
            setCategory(selectedProduct.category);
            setProductQuantity(selectedProduct.quantity);
            setProductDate(selectedProduct.addedDate);
        }
    }, [selectedProduct]);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const handleAddedProduct = async (e) => {
        e.preventDefault();

        if (market.trim() && !stores.includes(market)) addStore(market);
        if (category.trim() && !categories.includes(category)) addCategory(category);

        const newProduct = {
            store: market,
            name: productName,
            brand: productBrand,
            price: parseFloat(productPrice),
            unit: `${unit} ${unitType}`,
            category: category,
            quantity: parseInt(productQuantity, 10),
            addedDate: productDate,
        };

        try {
            if (selectedProduct) {
                await updateProductInFirestore(selectedProduct.id, newProduct, productDate);
            } else {
                const addedProduct = await addProductToFirestore(newProduct);
                if (addedProduct) {
                    setProductList(prevProducts => [...prevProducts, addedProduct]);
                }
            }

            setSelectedProduct(null);
            setProductName("");
            setProductBrand("");
            setProductPrice(0);
            setMarket("");
            setUnit(0);
            setUnitType("g");
            setCategory("");
            setProductQuantity("");
            setProductDate(getDate());

            const updatedProducts = await fetchProducts();
            setProductList(updatedProducts);

        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }
    };

    return (
        <section>
            <form onSubmit={handleAddedProduct}>
                {[
                    ['Nombre Producto', productName, setProductName, 'text', 'name'],
                    ['Marca de Producto', productBrand, setProductBrand, 'text', 'brand'],
                    ['Precio', productPrice, setProductPrice, 'number', 'price'],
                    ['Unidad de medida', unit, setUnit, 'number', 'unit'],
                    ['Cantidad', productQuantity, setProductQuantity, 'number', 'quantity']
                ].map(([placeholder, value, setter, type, name]) => (
                    <FormInput
                        key={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={setter}
                        type={type}
                        name={name}
                    />
                ))}

                <input
                    type="date"
                    value={productDate}
                    onChange={(e) => setProductDate(e.target.value)}
                />

                <select onChange={(e) => setMarket(e.target.value)} value={market}>
                    <option value="">Seleccionar Tienda</option>
                    {stores.map((store) => <option key={store} value={store}>{store}</option>)}
                </select>
                <input
                    onChange={(e) => setMarket(e.target.value)}
                    type="text"
                    placeholder="Nueva Tienda"
                    value={market}
                />

                <select onChange={(e) => setCategory(e.target.value)} value={category}>
                    <option value="">Seleccionar Categoría</option>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input
                    onChange={(e) => setCategory(e.target.value)}
                    type="text"
                    placeholder="Nueva Categoría"
                    value={category}
                />

                <select onChange={(e) => setUnitType(e.target.value)} value={unitType}>
                    {['g', 'kg', 'ml', 'l'].map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                </select>

                <button type="submit">{selectedProduct ? "Actualizar Producto" : "Agregar Producto"}</button>
            </form>

            {auth.currentUser && (
                <button className="signout-button" onClick={handleSignOut}>Cerrar Sesión</button>
            )}
        </section>
    );
};

export { FormMarket };