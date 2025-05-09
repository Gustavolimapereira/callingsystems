// src/utils/avatar-delete-file.ts
import { promises as fs } from 'fs'
import * as path from 'path'

export async function deleteFile(relativePath: string): Promise<void> {
  const fullPath = path.resolve(__dirname, '..', '..', relativePath)

  try {
    await fs.unlink(fullPath)
    console.log('Arquivo excluído com sucesso:', fullPath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Erro ao excluir o arquivo:', (error as Error).message)
    } else {
      console.warn('Arquivo não encontrado para exclusão:', fullPath)
    }
  }
}
