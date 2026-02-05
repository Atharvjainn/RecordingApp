import {create} from 'zustand'


type ModalType = "Upload" | "Recorder" | "Auth" | null

type UiStore = {
    activeModal : ModalType,
    RecordControls : boolean,
    initialFile : File | null,
    addFile : (file : File | null) => void,
    removeFile : () => void,
    openRecordControls : () => void,
    closeRecordControls : () => void,
    open : (modal : ModalType) => void,
    close : () => void,
}


export const useUiStore = create<UiStore>((set,get) => ({
    activeModal : null,
    RecordControls : false,
    initialFile : null,
    addFile : (file : File | null) => {
        set({initialFile : file  })
    },
    removeFile : () => {
        set({initialFile : null})
    },
    openRecordControls : () => {
        set({RecordControls : true})
    },
    closeRecordControls : () => {
        set({RecordControls : false})
    },
    open : (modal : ModalType) => {
        set({activeModal : modal})
    },
    close : () => {
        set({activeModal : null})
    }

}))