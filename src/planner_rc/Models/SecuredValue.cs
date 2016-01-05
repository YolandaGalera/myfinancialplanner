using Api.Services;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace Api.Models
{
    public abstract class SecuredValue
    {
        public string EncryptedValue { get; set; }
        //[NotMapped]
        public float? Value
        { get; set; }

        public void decryptValue()
        {
            //if (EncryptedValue != null)
            //{
            //    return float.Parse(EncryptionService.Decrypt(EncryptedValue), CultureInfo.InvariantCulture.NumberFormat);
            //}
            //return 0;
            if (EncryptedValue == null)
            {
                Value = 0;
            }
            else
            {
                Value = float.Parse(EncryptionService.Decrypt(EncryptedValue), CultureInfo.InvariantCulture.NumberFormat);

            }
            EncryptedValue = null;
        }

        public void encryptValue()
        {
            if(Value == null)
            {
                return;
            }
            float valueToEncrypt = (float)Value;
            EncryptedValue = EncryptionService.Encrypt(valueToEncrypt.ToString(CultureInfo.InvariantCulture.NumberFormat));
            Value = null;
        }
    }
}