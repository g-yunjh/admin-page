import { supabase } from './supabase'

export const storage = {
  getImageUrl(furnitureId: string, imagePath: string): string {
    const { data } = supabase.storage
      .from('furniture-images')
      .getPublicUrl(`${furnitureId}/${imagePath}`)
    
    return data.publicUrl
  },

  getContactAttachmentUrl(contactId: string, filePath: string): string {
    const { data } = supabase.storage
      .from('contact-attachments')
      .getPublicUrl(`${contactId}/${filePath}`)
    
    return data.publicUrl
  },

  async downloadAttachment(contactId: string, filePath: string): Promise<Blob> {
    const { data, error } = await supabase.storage
      .from('contact-attachments')
      .download(`${contactId}/${filePath}`)

    if (error) {
      throw new Error(`Failed to download attachment: ${error.message}`)
    }

    return data
  }
}
