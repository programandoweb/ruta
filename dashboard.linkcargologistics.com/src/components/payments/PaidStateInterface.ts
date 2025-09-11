// Interfaces
export default interface PaidState {
    amount: number;
    method: any;
    tour_id: number;
    status_order_paid_id: string[]; // Ajusta según los datos reales si es un arreglo de strings
  }