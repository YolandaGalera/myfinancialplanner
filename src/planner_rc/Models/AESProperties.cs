
namespace Api.Models
{
    //[Serializable]
    public class AESProperties
    {
        public byte[] InitializationVector { get; set; }
        public byte[] Key { get; set; }
    }
}