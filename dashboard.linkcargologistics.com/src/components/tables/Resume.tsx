import React, { Fragment } from 'react';

interface ProductProps {
  id: number;
  Producto	: string;
  price: string;
  slug: string;
  resume: {
    variantItems: Array<any>;
    rawItems: Array<any>;
    category: string;
    variantItems_total:Array<any>;
  };
}

const ResumeComponent: React.FC<ProductProps> = ({ Producto	, price, slug, resume }) => {
  if (!resume) return null;

  console.log(resume.variantItems_total)

  return (
    <Fragment>
      <div className="p-6 max-w-[80%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-1 border-b">
            {/* Product Details */}
            <div className="col-span-3">
                <strong>Producto: </strong>{Producto}
            </div>
            <div className="col-span-3">
                <strong>Categoría: </strong>{resume.category}
            </div>
            {/* Raw Items */}
            <div className="col-span-3 mt-6 border-b pb-2">
                <h5 className="text-lg font-bold">Materia Prima</h5>
                <div className="grid grid-cols-1  gap-4">
                    {resume.rawItems.length > 0 ? (
                        resume.rawItems.map((item, index) => (
                            <div key={index}>
                                {item.raw.label}  <b>({item.quantity} {item?.raw?.medida?.label})</b>
                            </div>
                        ))
                    ) : (
                        <div className='col-span-3'>No hay materiales disponibles.</div>
                    )}
                </div>                
            </div>
            {/* Variant Items */}
            <div className="col-span-3 mt-2">
                <h5 className="text-lg font-bold">Variantes del Producto</h5>
                <div className="grid grid-cols-1  gap-4">
                    {resume.variantItems_total.length > 0 ? (
                        resume.variantItems_total.map((item, index) => (
                            <div key={index}>
                                <b>{item.label}</b> {item.totalEntries} fabricadas - {item.totalExit} vendidas <b>{item.result} unidades disponibles</b>
                            </div>
                        ))
                    ) : (
                        <div className='col-span-3'>No hay variantes disponibles.</div>
                    )}
                </div>
            </div>        
        </div>        
      </div>
    </Fragment>
  );
};

export default ResumeComponent;
