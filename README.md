# 🍽️ jajan.in — Aplikasi Direktori Warung Kantin

**jajan.in** adalah aplikasi web untuk menjelajahi dan mengelola informasi warung kantin. Proyek ini dikembangkan untuk memenuhi **Tugas 4 — Integrasi Frontend React dengan Backend API**, yang mencakup komunikasi frontend dan backend, operasi CRUD, autentikasi menggunakan JSON Web Token (JWT), serta pengaturan hak akses berdasarkan role pengguna.

Aplikasi menggunakan **React dan TypeScript** pada sisi frontend, **Node.js dan Express** pada sisi backend, serta **Microsoft SQL Server** sebagai database. Komunikasi antara frontend dan backend dilakukan menggunakan **Axios** melalui REST API.

## 1. Fitur Aplikasi

- Menampilkan daftar warung dari backend.
- Melakukan pencarian warung berdasarkan nama.
- Memfilter warung berdasarkan kategori.
- Menampilkan daftar warung dengan pagination.
- Menampilkan detail warung berdasarkan ID.
- Registrasi, login, dan logout pengguna.
- Menampilkan profil pengguna yang sedang login.
- Menambahkan, mengubah, dan menghapus data warung sesuai hak akses.
- Menerapkan hak akses berdasarkan role Admin, Owner, dan Customer.
- Menampilkan kondisi loading, empty state, dan error state.
- Menerapkan autentikasi dan otorisasi pada endpoint backend yang dilindungi.

## 2. Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| Frontend | React, TypeScript, Vite, CSS |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | Microsoft SQL Server |
| Nama Database | `review_kantin` |
| Autentikasi | JSON Web Token (JWT) |
| Dokumentasi dan Pengujian API | Swagger UI |
| Pengujian Integrasi | Chrome DevTools Network |

## 3. Hak Akses Pengguna

Aplikasi menerapkan sistem *Role-Based Access Control* (RBAC) untuk membatasi fitur berdasarkan kewenangan pengguna.

| Aktivitas | Admin | Owner | Customer |
|---|:---:|:---:|:---:|
| Melihat daftar warung | ✅ | ✅ | ✅ |
| Melihat detail warung | ✅ | ✅ | ✅ |
| Menambah warung | ✅ | ✅ | ❌ |
| Mengubah warung milik sendiri | ✅ | ✅ | ❌ |
| Mengubah warung milik pengguna lain | ✅ | ❌ | ❌ |
| Menghapus warung | ✅ | ❌ | ❌ |
| Melihat profil pengguna | ✅ | ✅ | ✅ |

**Admin** memiliki hak akses untuk menambah, mengubah, dan menghapus seluruh data warung melalui halaman Kelola Warung.

**Owner** memiliki hak akses untuk menambahkan warung dan mengubah informasi warung miliknya sendiri melalui halaman Warung Saya.

**Customer** dapat melihat daftar dan detail warung serta mengakses informasi profilnya setelah login, tetapi tidak dapat melakukan operasi pengelolaan warung.

Pengunjung yang belum login juga dapat melihat daftar dan detail warung tanpa autentikasi.

Pembatasan akses diterapkan pada antarmuka frontend dan diperiksa kembali pada backend agar pengguna tidak dapat menjalankan operasi di luar kewenangannya.

## 4. Struktur Proyek

Aplikasi terdiri atas dua bagian utama:

- **Frontend:** Menyediakan antarmuka aplikasi menggunakan React dan TypeScript.
- **Backend:** Menyediakan REST API, autentikasi, otorisasi, dan komunikasi dengan database SQL Server.

Nama direktori frontend dan backend mengikuti struktur repository proyek.

## 5. Persyaratan Sistem

Sebelum menjalankan aplikasi, pastikan perangkat telah memiliki:

- Node.js dan npm yang kompatibel dengan dependensi proyek.
- Microsoft SQL Server yang aktif.
- Database `review_kantin` beserta tabel yang diperlukan.
- Kode sumber frontend dan backend.
- Konfigurasi environment backend untuk koneksi database dan JWT.
- Browser modern seperti Google Chrome.

## 6. Cara Menjalankan Proyek

### 6.1 Clone Repository

Clone repository menggunakan Git:

```bash
git clone <URL_REPOSITORY_GITHUB>
```

Masuk ke direktori repository:

```bash
cd <NAMA_FOLDER_REPOSITORY>
```

Ganti placeholder dengan URL dan nama folder repository yang sebenarnya.

### 6.2 Persiapan Database

Pastikan Microsoft SQL Server telah berjalan dan database aplikasi tersedia.

Database yang digunakan pada pengembangan adalah:

```sql
USE review_kantin;
GO
```

Untuk memeriksa data warung pada tabel `dbo.stalls`, jalankan:

```sql
SELECT *
FROM dbo.stalls;
```

Jika database belum tersedia, buat atau impor database beserta struktur tabel yang diperlukan sesuai skema backend proyek.

Pastikan konfigurasi koneksi SQL Server pada backend sesuai dengan nama server, nama database, dan metode autentikasi yang digunakan.

### 6.3 Menjalankan Backend

Buka terminal pada direktori backend proyek.

Instal dependensi:

```bash
npm install
```

Siapkan konfigurasi environment backend sesuai variabel yang digunakan pada kode sumber, terutama untuk:

- Koneksi Microsoft SQL Server.
- Nama database.
- Kredensial database.
- JWT secret.
- Port backend.

Jalankan backend menggunakan script yang tersedia pada `package.json`.

Apabila proyek menyediakan script `dev`, gunakan:

```bash
npm run dev
```

Pada pengembangan lokal, backend berjalan pada:

```text
http://localhost:3000
```

Base URL REST API:

```text
http://localhost:3000/api/v1
```

**Catatan:** Nama file environment, variabel konfigurasi, dan perintah menjalankan backend harus disesuaikan dengan implementasi dalam repository.

### 6.4 Menjalankan Frontend

Buka terminal baru pada direktori frontend proyek.

Instal dependensi:

```bash
npm install
```

Jalankan frontend:

```bash
npm run dev
```

Akses aplikasi melalui browser:

```text
http://localhost:5173
```

Pastikan backend dan database telah berjalan agar aplikasi dapat mengambil serta mengelola data warung.

Apabila frontend menggunakan environment variable untuk menentukan base URL API, sesuaikan nama variabel dan nilainya dengan konfigurasi Axios pada kode sumber.

Jika port backend atau frontend berubah, sesuaikan konfigurasi komunikasi API serta CORS pada backend.

## 7. Dokumentasi Endpoint API

Base URL:

```text
http://localhost:3000/api/v1
```

### 7.1 Endpoint Warung

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/stalls` | Mengambil daftar warung |
| GET | `/stalls/:id` | Mengambil detail warung berdasarkan ID |
| GET | `/stalls/categories` | Mengambil kategori warung |
| POST | `/stalls` | Menambahkan warung (Admin dan Owner) |
| PUT | `/stalls/:id` | Mengubah warung sesuai hak akses |
| DELETE | `/stalls/:id` | Menghapus warung (Admin) |

### 7.2 Endpoint Autentikasi

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/auth/register` | Mendaftarkan akun pengguna |
| POST | `/auth/login` | Melakukan autentikasi pengguna |
| GET | `/auth/me` | Mengambil informasi pengguna yang sedang login |

Endpoint yang memerlukan autentikasi menggunakan header:

```http
Authorization: Bearer <token>
```

Token JWT digunakan backend untuk memverifikasi identitas pengguna dan menentukan hak akses berdasarkan role.

## 8. Integrasi Frontend dan Backend

Integrasi frontend dan backend dilakukan melalui REST API menggunakan library **Axios**.

Frontend mengirimkan HTTP request berdasarkan aktivitas pengguna, kemudian mengolah respons backend untuk memperbarui tampilan aplikasi.

Metode HTTP yang digunakan meliputi:

- **GET:** Mengambil daftar warung, detail warung, kategori, serta informasi pengguna.
- **POST:** Menambahkan warung dan menjalankan proses registrasi atau login.
- **PUT:** Memperbarui data warung.
- **DELETE:** Menghapus data warung sesuai hak akses.

Aplikasi juga menggunakan token JWT untuk mengakses endpoint yang membutuhkan autentikasi.

## 9. Pengujian Aplikasi

Pengujian dilakukan melalui aplikasi React, Chrome DevTools Network, Swagger UI, serta pemeriksaan data secara langsung pada SQL Server.

### 9.1 Pengujian CRUD

Pengujian CRUD dilakukan untuk memastikan frontend dapat berkomunikasi dengan backend dalam proses pengelolaan data warung.

| Operasi | Endpoint | Respons yang diperoleh |
|---|---|---|
| Mengambil daftar | GET `/stalls` | 200 OK |
| Menambah warung | POST `/stalls` | 201 Created |
| Mengubah warung | PUT `/stalls/:id` | 200 OK |
| Menghapus warung | DELETE `/stalls/:id` | 200 OK |

Pengujian detail warung dilakukan melalui endpoint `GET /stalls/:id`.

### 9.2 Pengujian Autentikasi

Pengujian autentikasi mencakup:

- Registrasi pengguna baru.
- Login menggunakan email dan password.
- Pengambilan informasi pengguna melalui `GET /auth/me`.
- Logout dari aplikasi.

Informasi pengguna yang berhasil diautentikasi digunakan untuk menampilkan identitas dan menentukan role pada antarmuka.

### 9.3 Pengujian Hak Akses

Pengujian hak akses mencakup pemeriksaan perbedaan fitur yang tersedia bagi Admin, Owner, dan Customer.

Pengujian otorisasi juga mencakup skenario akses yang tidak diizinkan. Backend dirancang untuk menolak permintaan yang tidak memenuhi persyaratan autentikasi atau kewenangan pengguna.

Respons HTTP yang relevan meliputi:

- **401 Unauthorized:** Permintaan tidak memiliki autentikasi yang valid.
- **403 Forbidden:** Pengguna terautentikasi, tetapi tidak memiliki izin untuk melakukan operasi tertentu.

### 9.4 Pengujian Kondisi Antarmuka

Pengujian antarmuka mencakup:

- **Loading State:** Ditampilkan ketika frontend menunggu respons backend.
- **Empty State:** Ditampilkan saat pencarian tidak menghasilkan data.
- **Error State:** Ditampilkan ketika permintaan data mengalami kegagalan.

Pengujian dilakukan menggunakan fitur Network Throttling dan simulasi koneksi offline pada Chrome DevTools.

## 10. Verifikasi Perubahan Data pada Database

Verifikasi dilakukan untuk memastikan perubahan data dari frontend diproses oleh backend dan tercermin pada database Microsoft SQL Server.

Database yang digunakan:

```sql
USE review_kantin;
GO
```

Pemeriksaan tabel warung:

```sql
SELECT *
FROM dbo.stalls;
```

Salah satu pengujian CRUD menggunakan data sementara bernama **Warung Uji CRUD** dengan ID `1014`.

Data tersebut ditambahkan melalui akun Owner, diperbarui melalui operasi PUT, dan kemudian dihapus menggunakan akun Admin.

Pemeriksaan data berdasarkan ID dilakukan dengan query:

```sql
SELECT *
FROM dbo.stalls
WHERE id = 1014;
```

Setelah proses penghapusan, data dengan ID tersebut tidak lagi ditemukan pada tabel warung.

Pengujian ini digunakan untuk memverifikasi keterkaitan proses perubahan data antara frontend, backend, dan database.

**jajan.in — Good Food, Good Mood!**