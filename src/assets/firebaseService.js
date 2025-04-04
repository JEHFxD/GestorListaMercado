import { db } from "./firebase.config"; 
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, arrayUnion } from "firebase/firestore"; 

export const fetchProducts = async (setProductList) => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })).map((product) => ({
            ...product,
            price: product.prices[product.prices.length - 1].price,
        }));
        setProductList(products);
        return products;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
};

export const addProductToFirestore = async (product) => {
    try {
        const productData = {
            ...product,
            prices: [{ price: product.price, date: product.addedDate }],
            isActive: true, 
        };
        const docRef = await addDoc(collection(db, "products"), productData);
        return { id: docRef.id, ...productData }; 
    } catch (error) {
        console.error("Error al agregar producto:", error);
        return null;
    }
};


export const updateProductInFirestore = async (productId, updatedProduct, productDate) => {
    try {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
            ...updatedProduct,
            prices: arrayUnion({ price: updatedProduct.price, date: productDate })
        });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
    }
};

export const deactivateProductInFirestore = async (productId) => {
    try {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, { isActive: false });
    } catch (error) {
        console.error("Error al desactivar producto:", error);
    }
};

export const activateProductInFirestore = async (productId) => {
    try {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, { isActive: true });
    } catch (error) {
        console.error("Error al activar producto:", error);
    }
};

export const deleteProductFromFirestore = async (id) => {
    try {
        await deleteDoc(doc(db, "products", id));
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    }
};
