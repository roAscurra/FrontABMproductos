import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import TableComponent from "../../ui/Table/Table";
import IUnidadMedida from "../../../types/IUnidadMedida";
import articuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import { Box, Button, Container, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import IArticuloManufacturado from "../../../types/IArticuloManufacturado";
import { toggleModal } from "../../../redux/slices/Modal";
import ModalProducto from "../../ui/Modal/ModalAdd";
import { setArticuloManufacturado } from "../../../redux/slices/ArticuloManufacturado";
import ModalDelete from "../../ui/Modal/ModalDelete";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const Productos = () => {

  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const productoService = new articuloManufacturadoService();
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [productToEdit, setProductToEdit] = useState<IArticuloManufacturado | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchProductos = useCallback(async () => {
    try {
      const productos = await productoService.getAll(url + 'api/producto');
      const productosFiltrados = productos.filter((producto: IArticuloManufacturado) => !producto.eliminado);
      dispatch(setArticuloManufacturado(productosFiltrados));
      setFilteredData(productosFiltrados);
    } catch (error) {
      console.error("Error al obtener los productos", error);
    }
  }, [dispatch, productoService, url]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleAddProduct = () => {
    // Reset cuponToEdit to null when adding a new cupon
    setProductToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleOpenEditModal = (rowData: Row) => {
    setProductToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      unidadMedida: rowData.unidadMedida,
      descripcion: rowData.descripcion,
      tiempoEstimadoMinutos: rowData.tiempoEstimadoMinutos,
      preparacion: rowData.preparacion,
      articuloManufacturadoDetalles: rowData.articuloManufacturado,
    });
    dispatch(toggleModal({ modalName: 'modal' }));
  };

  const handleOpenDeleteModal = (rowData: Row) => {
    setProductToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      unidadMedida: rowData.unidadMedida,
      descripcion: rowData.descripcion,
      tiempoEstimadoMinutos: rowData.tiempoEstimadoMinutos,
      preparacion: rowData.preparacion,
      articuloManufacturadoDetalles: rowData.articuloManufacturado,
    });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false); // Utiliza el estado directamente para cerrar la modal de eliminación
  };

const handleDelete = async () => {
    try {
        if (productToEdit && productToEdit.id) {
            await productoService.delete(url + 'productos', productToEdit.id.toString());
            console.log('Se ha eliminado correctamente.');
            handleCloseDeleteModal(); // Cerrar el modal de eliminación
            fetchProductos(); // Refrescar la lista de productos
        } else {
            console.error('No se puede eliminar el producto porque no se proporcionó un ID válido.');
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
};


  // Definición de las columnas para la tabla de artículos manufacturados
  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <span>{rowData.id}</span> },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <span>{rowData.denominacion}</span> },
    { id: "precioVenta", label: "Precio Venta", renderCell: (rowData) => <span>{rowData.precioVenta}</span> },
    {
      id: "unidadMedida",
      label: "Unidad Medida",
      renderCell: (rowData) => {
        // Verifica si la unidad de medida está presente y si tiene la propiedad denominacion
        const unidadMedida: IUnidadMedida = rowData.unidadMedida;
        if (unidadMedida && unidadMedida.denominacion) {
          return <span>{unidadMedida.denominacion}</span>;
        } else {
          // Si la unidad de medida no está presente o no tiene denominacion, muestra un valor por defecto
          return <span>Sin unidad de medida</span>;
        }
      }
    },
    { id: "descripcion", label: "Descripción", renderCell: (rowData) => <span>{rowData.descripcion}</span> },
    { id: "tiempoEstimadoMinutos", label: "Tiempo Estimado (min)", renderCell: (rowData) => <span>{rowData.tiempoEstimadoMinutos}</span> },
    {
        id: "imagenes",
        label: "Imágenes",
        renderCell: (rowData) => {
          const imagenes = rowData.imagenes;
          if (imagenes && imagenes.length > 0) {
            return (
                <div style={{ display: 'flex', gap: '5px' }}>
                  {imagenes.map((imagen: any, index: number) => (
                    <img key={index} src={imagen.url} alt={`Imagen ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
                  ))}
                </div>
              );
          } else {
            return <span>No hay imágenes disponibles</span>;
          }
        }
      },      
  ];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        my: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 1,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Productos
          </Typography>
          <Button
            sx={{
              bgcolor: "#000", // Terracota
              "&:hover": {
                bgcolor: "#808080", // Terracota más oscuro al pasar el mouse
              },
            }}
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddProduct}
          >
            Producto
          </Button>
        </Box>
     
        {/* Componente de tabla para mostrar los artículos manufacturados */}
        <TableComponent data={filteredData} columns={columns} handleOpenEditModal={handleOpenEditModal} 
        handleOpenDeleteModal={handleOpenDeleteModal} 
        />
        <ModalProducto getProducts={fetchProductos} productToEdit={productToEdit !== null ? productToEdit : undefined} />
        <ModalDelete show={deleteModalOpen} onHide={handleCloseDeleteModal} product={productToEdit} onDelete={handleDelete} />


      </Container>
    </Box>  
    );
}
