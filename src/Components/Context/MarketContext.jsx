import { createContext, useState, useEffect } from "react";
import { db } from "../../assets/firebase.config";
import { collection, getDocs } from "firebase/firestore";

export const MarketContext = createContext();

export const MarketContextHandler = ({ children }) => {
    const [productName, setProductName] = useState("");
    const [productBrand, setProductBrand] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productList, setProductList] = useState([]);
    const [market, setMarket] = useState("");
    const [unit, setUnit] = useState("");
    const [category, setCategory] = useState("");
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [unitType, setUnitType] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filterName, setFilterName] = useState("");
    const [filterBrand, setFilterBrand] = useState("");
    const [filterPrice, setFilterPrice] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterDate, setFilterDate] = useState('');

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const products = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                price: doc.data().prices[doc.data().prices.length - 1].price,
            }));

            setProductList(products);
            return products;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return [];
        }
    };

    useEffect(() => {
        const loadProducts = async () => {
            await fetchProducts();
        };
        loadProducts();
    }, []);

    const addStore = (storeName) => {
        setStores([...stores, storeName]);
    };

    const addCategory = (categoryName) => {
        setCategories([...categories, categoryName]);
    };

    const updateProduct = (index, updatedProduct) => {
        const updatedProducts = [...productList];
        updatedProducts[index] = updatedProduct;
        setProductList(updatedProducts);
    };

    return (
        <MarketContext.Provider
            value={{
                productName, setProductName, productBrand, setProductBrand, productPrice, setProductPrice, productList, setProductList,market,
                setMarket, unit, setUnit, category, setCategory, stores, setStores, categories, setCategories, addStore, addCategory,
                updateProduct, unitType, setUnitType, productQuantity, setProductQuantity, selectedProduct, setSelectedProduct, 
                fetchProducts, filterName, setFilterName, filterBrand, setFilterBrand, filterPrice, setFilterPrice, filterCategory, setFilterCategory,
                filterType, setFilterType,filterDate, setFilterDate
            }}
        >
            {children}
        </MarketContext.Provider>
    );
};
