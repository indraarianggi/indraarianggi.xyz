# Panduan Mengganti Tema Syntax Highlighting

Dokumentasi ini menjelaskan cara mengganti tema syntax highlighting untuk blok code pada proyek ini.

## Struktur Implementasi

Syntax highlighting pada proyek ini diimplementasikan menggunakan:

1. **rehype-pretty-code** - Plugin untuk memproses code blocks
2. **GitHub Dark theme** - Tema default yang digunakan
3. **CSS kustom** - Untuk memastikan tema gelap selalu ditampilkan

## Lokasi File Konfigurasi

### 1. Konfigurasi rehype-pretty-code

File: [`astro.config.mjs`](astro.config.mjs:20-30)

```javascript
[
  rehypePrettyCode,
  {
    theme: 'github-dark',    // Tema yang digunakan (selalu gelap)
    keepBackground: false,   // Biarkan CSS mengatur background
    defaultLang: 'plaintext',
    grid: false,            // Nonaktifkan grid layout
  },
],
```

### 2. CSS untuk Syntax Highlighting

File: [`src/styles/globals.css`](src/styles/globals.css:115-250)

CSS untuk syntax highlighting terletak di dalam `@layer base` dengan komentar:

```
/*
* Syntax highlighting styles using rehype-pretty-code
* Using GitHub Dark theme for both light and dark mode
*/
```

## Cara Mengganti Tema

### Langkah 1: Pilih Tema

Pilih tema yang tersedia dari [shiki-themes](https://github.com/shikijs/shiki/blob/main/docs/themes.md). Beberapa tema populer:

- `github-dark` (saat ini digunakan)
- `github-light`
- `vscode-dark`
- `monokai`
- `dracula`
- `one-dark-pro`
- `nord`

### Langkah 2: Update Konfigurasi di astro.config.mjs

Ubah bagian `theme` pada konfigurasi `rehypePrettyCode`:

```javascript
theme: {
  dark: 'nama-tema-gelap',    // Ganti dengan tema gelap yang diinginkan
  light: 'nama-tema-terang',  // Ganti dengan tema terang yang diinginkan
},
```

Contoh jika ingin menggunakan tema `vscode-dark` untuk mode gelap dan `github-light` untuk mode terang:

```javascript
theme: {
  dark: 'vscode-dark',
  light: 'github-light',
},
```

### Langkah 3: Update CSS (Opsional)

Jika Anda ingin mengubah warna background atau teks secara manual, update bagian berikut di [`src/styles/globals.css`](src/styles/globals.css:115-250):

```css
/* Code block container */
pre {
  background-color: #0d1117 !important; /* Ganti dengan warna background yang diinginkan */
  color: #c9d1d9 !important; /* Ganti dengan warna teks yang diinginkan */
  /* ... properti lainnya ... */
}

/* Inline code */
:not(pre) > code {
  background-color: #0d1117 !important; /* Ganti dengan warna background yang diinginkan */
  color: #c9d1d9 !important; /* Ganti dengan warna teks yang diinginkan */
  /* ... properti lainnya ... */
}
```

### Langkah 4: Restart Development Server

Setelah melakukan perubahan, restart development server:

```bash
npm run dev
```

## Opsi Konfigurasi Lainnya

### Menonaktifkan Tema Gelap di Mode Terang

Jika Anda ingin syntax highlighting mengikuti tema sistem (bukan selalu gelap):

1. Hapus `!important` dari CSS di [`src/styles/globals.css`](src/styles/globals.css:115-250)
2. Hapus bagian override di akhir file:
   ```css
   /* Override light mode styles for code blocks */
   :root {
     pre,
     :not(pre) > code,
     figure,
     figcaption {
       background-color: #0d1117 !important;
       color: #c9d1d9 !important;
     }
   }
   ```
3. Pastikan konfigurasi di [`astro.config.mjs`](astro.config.mjs:20-30) menggunakan tema yang berbeda untuk mode gelap dan terang

### Menambahkan Fitur Tambahan

#### Line Numbers

Untuk menambahkan nomor baris pada code blocks, tambahkan konfigurasi berikut di [`astro.config.mjs`](astro.config.mjs:20-30):

```javascript
[
  rehypePrettyCode,
  {
    // ... konfigurasi lainnya ...
    grid: true, // Aktifkan grid layout
    lineNumbers: true, // Tampilkan nomor baris
  },
],
```

#### Copy Button

Untuk menambahkan tombol copy pada code blocks, Anda perlu membuat komponen React dan menambahkannya ke MDX. Ini memerlukan implementasi tambahan di luar scope konfigurasi syntax highlighting.

## Troubleshooting

### Warna Tidak Berubah

Jika warna syntax highlighting tidak berubah setelah mengganti tema:

1. Pastikan Anda sudah merestart development server
2. Hapus folder `dist` dan build ulang proyek:
   ```bash
   rm -rf dist
   npm run build
   npm run dev
   ```
3. Periksa apakah ada CSS lain yang mengoverride style syntax highlighting

### Error TypeScript

Jika mendapatkan error TypeScript saat mengubah konfigurasi:

1. Pastikan nama tema yang digunakan valid
2. Tambahkan `// @ts-ignore` jika perlu untuk mengabaikan error tertentu
3. Pastikan semua opsi konfigurasi memiliki tipe yang benar

## Referensi

- [rehype-pretty-code Documentation](https://rehype-pretty.pages.dev/)
- [Shiki Themes](https://github.com/shikijs/shiki/blob/main/docs/themes.md)
- [Astro MDX Integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)
