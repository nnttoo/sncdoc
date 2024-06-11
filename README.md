# Supercharged Note Creator

Create markdown with more complete features with .sncdoc

# sncdoc Example
To see how to use srcdoc, look in   [example](./example) folder

# contoh menampilkan mermaid

```````
```embed_mermaid
flowchart TD
    A[Halaman Utama] --> B[Tombol Daftar Menu]
    A --> C[Tombol Tambah Menu]
    A --> D[Tampilan Saldo]
    
    B --> E[Menampilkan Daftar Menu]
    C --> F[Formulir Tambah Menu]
    D --> G[Menampilkan Saldo Pengguna]
    
    %% Tambahkan node database
    E --> DB1[(Database Menu)]
    F --> DB1
    G --> DB2[(Database Saldo)] 
```
```````


# Contoh Eval


```````
```eval_js

    console.log(this.mdText);

```
```````
Eval akan dieksekusi di browser, sehingga kita bisa gunakan untuk mengubah text markdown,
untuk mengakses text markdown gunakan ``this.mdText``
 
# Contoh Dictionary

``````
```dictionary_json
{

    "initest" : "ini isi dari\n\n test",
    "inijugatest" : "nah inilah isinya"
}

```
``````

### penggunaannya di text markdown (SNCDOC)

```md

    DICT[initest]

    DICT[date]
```


### Table dengan New Line

Biasanya table akan error jika ditulis dengan cara seperti ini

```md
|    |                |
|----|----------------|
|ini table | ini isin
                ini isi panjang
                            yang|
```


Kita bisa gunakan seperti ini

````
SNC_TABLE
|    |                |
|----|----------------|
|ini table | ini isin
                ini isi panjang
                            yang|

END_SNC_TABLE
````

**SNC_TABLE akan mengabaikan newLine yang tidak diawali dengan tanda |**

sehingga code di atas akan diconversi di file .md menjadi seperti ini

```md

|    |                |
|----|----------------|
|ini table | ini isin                ini isi panjang                            yang|

```


## Catatan untuk developer
cara deploy

```bash

npm install -g vsce
vsce package
```