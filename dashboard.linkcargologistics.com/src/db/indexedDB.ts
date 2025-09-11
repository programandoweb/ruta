/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import Dexie, { Table } from 'dexie';

export interface Product {
  id: number;        // ID viene del backend
  name: string;
  price: number;
  category?: string;
  stock?: number;
}

export interface Category {
  id: number;
  label: string;
  grupo: string;
  childrens?: Category[];
}

export interface PendingSync {
  id?: number;
  type: 'order' | 'action';
  payload: any;
  created_at: Date;
}

export class AppDB extends Dexie {
  products!: Table<Product, number>;
  categories!: Table<Category, number>;
  pending_sync!: Table<PendingSync, number>;

  constructor() {
    super('IvoolveDB');
    this.version(2).stores({
      // Usamos id como clave natural (no autoincremental) porque viene del backend
      products: 'id, name, price, category',
      categories: 'id, label, grupo',
      pending_sync: '++id, type, created_at',
    });
  }
}

export const db = new AppDB();
