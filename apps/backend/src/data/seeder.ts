import * as admin from 'firebase-admin';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '@yogo/shared';
import { logger } from '../utils/logger';

export async function seedDatabaseIfEmpty(db: admin.firestore.Firestore) {
  const productsColl = db.collection('products');
  const snapshot = await productsColl.limit(1).get();
  if (snapshot.empty) {
    logger.info('Seeding initial products into Firestore...');
    const batch = db.batch();
    INITIAL_PRODUCTS.forEach((p) => {
      const docRef = productsColl.doc(String(p.id));
      batch.set(docRef, p);
    });
    await batch.commit();
  }

  const couponsColl = db.collection('coupons');
  const couponSnapshot = await couponsColl.limit(1).get();
  if (couponSnapshot.empty) {
    logger.info('Seeding initial coupons into Firestore...');
    const batch = db.batch();
    INITIAL_COUPONS.forEach((c) => {
      const docRef = couponsColl.doc(c.code);
      batch.set(docRef, c);
    });
    await batch.commit();
  }
}

export async function forceSeed(db: admin.firestore.Firestore) {
  const productsColl = db.collection('products');
  const couponsColl = db.collection('coupons');

  const pBatch = db.batch();
  INITIAL_PRODUCTS.forEach((p) => {
    pBatch.set(productsColl.doc(String(p.id)), p);
  });
  await pBatch.commit();

  const cBatch = db.batch();
  INITIAL_COUPONS.forEach((c) => {
    cBatch.set(couponsColl.doc(c.code), c);
  });
  await cBatch.commit();
}
