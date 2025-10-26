import { Lock, LockOpen, TextFields } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'
import type { EditorOptions } from '@tiptap/core'
import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  TableBubbleMenu,
  insertImages,
  type RichTextEditorRef
} from 'mui-tiptap'
import { useCallback, useRef, useState } from 'react'
import EditorMenuControls from './EditorMenuControls'
import useExtensions from './useExtensions'
import { Controller, useForm, useFormContext } from 'react-hook-form'

function fileListToImageFiles(fileList: FileList): File[] {
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || '').toLowerCase()
    return mimeType.startsWith('image/')
  })
}

interface Props {
  name: string
}

export default function Editor({ name }: Props) {
  const extensions = useExtensions({
    placeholder: 'Add your own content here...'
  })
  const rteRef = useRef<RichTextEditorRef>(null)
  const [isEditable, setIsEditable] = useState(true)
  const [showMenuBar, setShowMenuBar] = useState(true)

  const {
    control,
    formState: { errors }
  } = useFormContext()

  const handleNewImageFiles = useCallback((files: File[], insertPosition?: number): void => {
    if (!rteRef.current?.editor) {
      return
    }

    const attributesForImageFiles = files.map((file) => ({
      src: URL.createObjectURL(file),
      alt: file.name
    }))

    insertImages({
      images: attributesForImageFiles,
      editor: rteRef.current.editor,
      position: insertPosition
    })
  }, [])

  const handleDrop: NonNullable<EditorOptions['editorProps']['handleDrop']> = useCallback(
    (view, event, _slice, _moved) => {
      if (!(event instanceof DragEvent) || !event.dataTransfer) {
        return false
      }

      const imageFiles = fileListToImageFiles(event.dataTransfer.files)
      if (imageFiles.length > 0) {
        const insertPosition = view.posAtCoords({
          left: event.clientX,
          top: event.clientY
        })?.pos

        handleNewImageFiles(imageFiles, insertPosition)
        event.preventDefault()
        return true
      }

      return false
    },
    [handleNewImageFiles]
  )

  const handlePaste: NonNullable<EditorOptions['editorProps']['handlePaste']> = useCallback(
    (_view, event, _slice) => {
      if (!event.clipboardData) {
        return false
      }

      const pastedImageFiles = fileListToImageFiles(event.clipboardData.files)
      if (pastedImageFiles.length > 0) {
        handleNewImageFiles(pastedImageFiles)
        return true
      }
      return false
    },
    [handleNewImageFiles]
  )

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <RichTextEditor
              ref={rteRef}
              extensions={extensions}
              content={field.value}
              onUpdate={() => {
                field.onChange(rteRef.current?.editor?.getHTML() ?? '')
              }}
              editable={isEditable}
              editorProps={{
                handleDrop: handleDrop,
                handlePaste: handlePaste
              }}
              renderControls={() => <EditorMenuControls />}
              RichTextFieldProps={{
                variant: 'outlined',
                MenuBarProps: {
                  hide: !showMenuBar
                },
                footer: (
                  <Stack
                    direction='row'
                    spacing={2}
                    sx={{
                      borderTopStyle: 'solid',
                      borderTopWidth: 1,
                      borderTopColor: (theme) => theme.palette.divider,
                      py: 1,
                      px: 1.5
                    }}
                  >
                    <MenuButton
                      value='formatting'
                      tooltipLabel={showMenuBar ? 'Hide formatting' : 'Show formatting'}
                      size='small'
                      onClick={() => setShowMenuBar((currentState) => !currentState)}
                      selected={showMenuBar}
                      IconComponent={TextFields}
                    />

                    <MenuButton
                      value='formatting'
                      tooltipLabel={isEditable ? 'Prevent edits (use read-only mode)' : 'Allow edits'}
                      size='small'
                      onClick={() => setIsEditable((currentState) => !currentState)}
                      selected={!isEditable}
                      IconComponent={isEditable ? Lock : LockOpen}
                    />
                  </Stack>
                )
              }}
              sx={{
                '& .ProseMirror': {
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    scrollMarginTop: showMenuBar ? 50 : 0
                  }
                }
              }}
            >
              {() => (
                <>
                  <LinkBubbleMenu />
                  <TableBubbleMenu />
                </>
              )}
            </RichTextEditor>
          )
        }}
      />
      <Typography sx={{ pl: 1, pt: 1, fontSize: '12px', color: 'red' }}>{errors?.[name]?.message as string}</Typography>
    </>
  )
}
