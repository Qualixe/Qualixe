-- Add background_color column to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS background_color VARCHAR(7) DEFAULT '#ffffff';

-- Update existing clients with random colors if they don't have one
UPDATE clients 
SET background_color = CASE 
  WHEN background_color IS NULL OR background_color = '#ffffff' THEN 
    (ARRAY['#f0f9ff', '#fef3c7', '#fce7f3', '#dbeafe', '#e0e7ff', '#fef2f2', '#ecfccb', '#f3e8ff'])[floor(random() * 8 + 1)]
  ELSE background_color
END;

-- Add comment
COMMENT ON COLUMN clients.background_color IS 'Background color for client logo display (hex format)';
