import React, { useContext } from "react";
import { MarketContext } from "../Context/MarketContext";

const FilterInput = () => {
    const {
        filterType,
        setFilterType,
        filterName,
        setFilterName,
        filterBrand,
        setFilterBrand,
        filterPrice,
        setFilterPrice,
        filterCategory,
        setFilterCategory,
    } = useContext(MarketContext);

    const handleChange = (e) => {
        const value = e.target.value;
        switch (filterType) {
            case "name":
                setFilterName(value);
                break;
            case "brand":
                setFilterBrand(value);
                break;
            case "price":
                setFilterPrice(value);
                break;
            case "category":
                setFilterCategory(value);
                break;
            default:
                break;
        }
    };

    const getPlaceholder = () => {
        switch (filterType) {
            case "name":
                return "Filtrar por nombre";
            case "brand":
                return "Filtrar por marca";
            case "price":
                return "Filtrar por precio";
            case "category":
                return "Filtrar por categoría";
            default:
                return "";
        }
    };

    const getValue = () => {
        switch (filterType) {
            case "name":
                return filterName;
            case "brand":
                return filterBrand;
            case "price":
                return filterPrice;
            case "category":
                return filterCategory;
            default:
                return "";
        }
    };

    const getType = () => {
        if (filterType === "price") {
            return "number";
        }
        return "text";
    };

    return (
        <div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">Seleccionar filtro</option>
                <option value="name">Nombre</option>
                <option value="brand">Marca</option>
                <option value="price">Precio</option>
                <option value="category">Categoría</option>
            </select>
            {filterType && (
                <input
                    type={getType()}
                    placeholder={getPlaceholder()}
                    value={getValue()}
                    onChange={handleChange}
                />
            )}
        </div>
    );
};

export default FilterInput;