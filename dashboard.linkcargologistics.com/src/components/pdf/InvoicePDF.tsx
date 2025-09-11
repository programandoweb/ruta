'use client'

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { NextPage } from 'next'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { useState } from 'react'

interface Item {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  description: string
}

interface Props {
  items: Item[]
  total: number
}

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  table: { width: '100%', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottom: '1pt solid #e0e0e0' },
  tableColHeader: { flex: 1, backgroundColor: '#1D4ED8', padding: 5 },
  tableCol: { flex: 1, padding: 5 },
  tableCellHeader: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  tableCell: { fontSize: 9 },
  total: { fontSize: 14, textAlign: 'right', marginTop: 10, fontWeight: 'bold' },
})

const InvoiceDocument = ({ items, total }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Factura / Comanda</Text>

      {/* Encabezado de tabla */}
      <View style={[styles.table, styles.tableRow]}>
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Producto</Text></View>
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Categoría</Text></View>
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Descripción</Text></View>
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Cant.</Text></View>
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Precio</Text></View>
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Subtotal</Text></View>
      </View>

      {/* Filas */}
      {items.map((item, i) => (
        <View style={styles.tableRow} key={i}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{item.name}</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{item.category}</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{item.description}</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity}</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>${item.price.toFixed(2)}</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>${(item.price * item.quantity).toFixed(2)}</Text></View>
        </View>
      ))}

      {/* Total */}
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
    </Page>
  </Document>
)

const InvoicePDF: NextPage<Props> = ({ items, total }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="mt-4">
      <button
        onClick={() => setShow(true)}
        className="w-full bg-purple-600 text-white py-2 rounded-lg shadow hover:bg-purple-700"
      >
        Generar PDF
      </button>
      {show && (
        <PDFDownloadLink
          document={<InvoiceDocument items={items} total={total} />}
          fileName="factura.pdf"
          className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
        >
          Descargar PDF
        </PDFDownloadLink>
      )}
    </div>
  )
}

export default InvoicePDF
