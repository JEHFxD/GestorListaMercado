import { useContext, useEffect, useMemo, useState } from "react";
import { MarketContext } from "../Context/MarketContext";
import {
	deleteProductFromFirestore,
	deactivateProductInFirestore,
	activateProductInFirestore,
} from "../../assets/firebaseService";
import FilterInput from "../Filter/FilterInput";
import PriceComparison from "../PriceComparison/PriceComparison";

export const ListMarket = () => {
	const [showPriceComparison, setShowPriceComparison] = useState(false);
	
	const {
		productList,
		setProductList,
		fetchProducts,
		filterName,
		filterBrand,
		filterPrice,
		filterCategory,
		filterDate,
		setFilterDate,
		setSelectedProduct,
		selectedProduct
	} = useContext(MarketContext);

	const getDate = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		return `${year}-${month}`;
	};

	const activeProducts = useMemo(() => {
		return productList.map((product) => ({
			...product,
			status: product.isActive ? "Activo" : "Inactivo",
		}));
	}, [productList]);

	const filteredProducts = useMemo(() => {
		return activeProducts.filter((product) => {
			const nameMatch = product.name.toLowerCase().includes(filterName.toLowerCase());
			const brandMatch = product.brand.toLowerCase().includes(filterBrand.toLowerCase());
			const priceMatch = filterPrice === "" || product.price.toString().includes(filterPrice);
			const categoryMatch = product.category.toLowerCase().includes(filterCategory.toLowerCase());
			const dateMatch = !filterDate || product.addedDate === filterDate;
			return nameMatch && brandMatch && priceMatch && categoryMatch && dateMatch;
		});
	}, [, activeProducts, filterName, filterBrand, filterPrice, filterCategory, filterDate]);

	const [displayTotal, setDisplayTotal] = useState(0)

	useEffect(() => {
		if (filteredProducts.length > 0) {
			let a = 0
			filteredProducts.forEach((p) => {
				a += p.price
			})
			setDisplayTotal(a)
		} else {
			setDisplayTotal(0)
		}
	}, [filteredProducts])

	useEffect(() => {
	}, [, displayTotal])

	const handleEditProduct = (product) => {
		setSelectedProduct({
			...product,
			price: parseFloat(product.price) || 0,
			quantity: parseInt(product.quantity, 10) || 1,
			unit: product.unit || 'unidad', 
			store: product.store || '', 
			category: product.category || '' 
		  });
		  console.log('Producto seleccionado para editar:', product);
		};

	const handleDeleteProduct = async (id) => {
		try {
			await deleteProductFromFirestore(id);
			const updatedProducts = await fetchProducts();
			setProductList(updatedProducts);
		} catch (error) {
			console.error("Error al eliminar el producto:", error);
		}
	};

	const handleDeactivateProduct = async (id) => {
		try {
			await deactivateProductInFirestore(id);
			const updatedProducts = await fetchProducts();
			setProductList(updatedProducts);
		} catch (error) {
			console.error("Error al desactivar el producto:", error);
		}
	};

	const handleActivateProduct = async (id) => {
		try {
			await activateProductInFirestore(id);
			const updatedProducts = await fetchProducts();
			setProductList(updatedProducts);
		} catch (error) {
			console.error("Error al activar el producto:", error);
		}
	};

	const calculateMonthlyExpenses = (products) => {
		const monthlyExpenses = {};

		products.forEach((product) => {
			const date = new Date(product.addedDate);
			const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

			if (!monthlyExpenses[monthYear]) {
				monthlyExpenses[monthYear] = 0;
			}

			monthlyExpenses[monthYear] += product.price * product.quantity;
		});

		return monthlyExpenses;
	};

	const getTotal = useMemo(() => {
		return displayTotal
	}, [displayTotal])

	const monthlyExpenses = useMemo(() => {
		return calculateMonthlyExpenses(productList);
	}, [productList]);

	return (
		<div className="main-content">
			<div className="form-section">
				<FilterInput />
				<input 
					type="date" 
					value={filterDate} 
					onChange={(e) => setFilterDate(e.target.value)} 
				/>
				<button onClick={() => setShowPriceComparison(!showPriceComparison)}>
					{showPriceComparison ? "Ocultar comparación de precios" : "Mostrar comparación de precios"}
				</button>
				{showPriceComparison && <PriceComparison products={filteredProducts} />}
			</div>
			
			<div className="list-section">
				<div className="products-container">
					{activeProducts.map((product) => (
						<div key={product.id} className="product-card">
							<div className="product-status">
								<span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
									{product.isActive ? "Activo" : "Inactivo"}
								</span>
								<span className="product-date">{product.addedDate}</span>
							</div>
							
							<div className="product-header">
								<h3 className="product-name">{product.name}</h3>
								<div className="product-price">${product.price.toFixed(2)}</div>
							</div>
							
							<div className="product-details-grid">
								<div className="detail-item">
									<span className="detail-label">Marca:</span>
									<span>{product.brand || 'No especificada'}</span>
								</div>
								<div className="detail-item">
									<span className="detail-label">Tienda:</span>
									<span>{product.store || 'No especificada'}</span>
								</div>
								<div className="detail-item">
									<span className="detail-label">Cantidad:</span>
									<span>{product.quantity} {product.unit}</span>
								</div>
								<div className="detail-item">
									<span className="detail-label">Categoría:</span>
									<span>{product.category || 'No especificada'}</span>
								</div>
								<div className="detail-item">
									<span className="detail-label">Unidad:</span>
									<span>{product.unit || 'No especificada'}</span>
								</div>
								<div className="detail-item">
									<span className="detail-label">Fecha registro:</span>
									<span>{product.addedDate || 'No especificada'}</span>
								</div>
							</div>
							
							<div className="product-actions">
								<button onClick={() => handleEditProduct(product)}>Editar</button>
								<button onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
								<button onClick={() => product.isActive ? 
									handleDeactivateProduct(product.id) : 
									handleActivateProduct(product.id)}>
									{product.isActive ? "Desactivar" : "Activar"}
								</button>
							</div>
						</div>
					))}
				</div>

				<div className="summary-section">
					<div className="total-section">
						<h3>Total: ${monthlyExpenses[getDate()]}</h3>
					</div>
					
					<div className="expenses-section">
						<h3>Resumen de Gastos por Mes</h3>
						<div className="expenses-list">
							{Object.entries(monthlyExpenses).map(([month, total]) => (
								<div key={month} className="expense-item">
									<span className="expense-month">{month}</span>
									<span className="expense-amount">${total.toFixed(2)}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ListMarket;
