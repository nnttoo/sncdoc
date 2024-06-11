export type Mtools = {
    saveText : (filename : string)=>Promise<any>
}

export type SncDocApi = {
    /**
     * tools for save file 
     */
    mtools  : Mtools,

    /**
     * string document that you can edit as a result of text markdown
     */
    mdText : string,

}