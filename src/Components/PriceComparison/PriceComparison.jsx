import { useState, useContext, useMemo } from "react";
import { MarketContext } from "../Context/MarketContext";

const PriceComparison = () => {
    const { productList } = useContext(MarketContext);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const getMonthlyPrices = (prices) => {
        if (!prices || prices.length === 0) {
            return { labels: [], data: [] };
        }

        const labels = prices.map(price => price.date);
        const data = prices.map(price => price.price);

        return { labels, data };
    };

    const priceComparisonData = useMemo(() => {
        if (selectedProduct) {
            const { labels, data } = getMonthlyPrices(selectedProduct.prices);
            return labels.map((label, index) => ({
                date: label,
                price: data[index],
            }));
        }
        return [];
    }, [selectedProduct]);

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        const product = productList.find(product => product.id === selectedProductId);
        setSelectedProduct(product);
    };

    return (
        <div className="price-comparator-container">
            <h2>Comparador de Precios</h2>

            <div>
                <select onChange={handleProductChange} value={selectedProduct ? selectedProduct.id : ''}>
                    <option value="">Seleccionar producto</option>
                    {productList.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name} - {product.brand}
                        </option>
                    ))}
                </select>
            </div>

            {selectedProduct && priceComparisonData.length > 0 ? (
                <div>
                    <h3>Comparación de Precios de {selectedProduct.name}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {priceComparisonData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.date}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p>Comparación de precios de {selectedProduct.name} en los últimos dos meses.</p>
                </div>
            ) : (
                <p>No hay datos de precios disponibles para el producto.</p>
            )}
        </div>
    );
};

export default PriceComparison;