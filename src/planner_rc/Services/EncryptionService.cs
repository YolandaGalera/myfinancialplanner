using System;
using System.IO;
using Api.Models;

namespace Api.Services
{
    public class EncryptionService
    {
        public static readonly string AES_PROPERTIES_PATH_IV = "aes-properties-IV.bin";
        public static readonly string AES_PROPERTIES_PATH_KEY = "aes-properties-KEY.bin";
        private static AESProperties aesProperties;

        public static void LoadProperties()
        {
            aesProperties = new AESProperties
            {
                InitializationVector = File.ReadAllBytes(AES_PROPERTIES_PATH_IV),
                Key = File.ReadAllBytes(AES_PROPERTIES_PATH_KEY)
            };
        }

        public static void GenerateKeyAndInitializationVectorIfNeeded()
        {
            if (!File.Exists(AES_PROPERTIES_PATH_IV) || !File.Exists(AES_PROPERTIES_PATH_KEY))
            {
                using (System.Security.Cryptography.Aes aesAlg = System.Security.Cryptography.Aes.Create())
                {
                    AESProperties aesProperties = new AESProperties { InitializationVector = aesAlg.IV, Key = aesAlg.Key };
                    WriteToBinaryFile(AES_PROPERTIES_PATH_IV, aesProperties.InitializationVector);
                    WriteToBinaryFile(AES_PROPERTIES_PATH_KEY, aesProperties.Key);
                }
            }
        }

        private static void WriteToBinaryFile(string filePath, byte[] objectToWrite)
        {
            using (Stream stream = File.Open(filePath, FileMode.Create))
            {
                stream.Write(objectToWrite, 0, objectToWrite.Length);
            }
        }

        public static string Encrypt(string plainText)
        {
            // Check arguments.
            if (plainText == null || plainText.Length <= 0)
                throw new ArgumentNullException("plainText");
            if (aesProperties.Key == null || aesProperties.Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (aesProperties.InitializationVector == null || aesProperties.InitializationVector.Length <= 0)
                throw new ArgumentNullException("Key");
            // Create an Aes object
            // with the specified key and IV.
            byte[] encrypted = null;

            using (System.Security.Cryptography.Aes aesAlg = System.Security.Cryptography.Aes.Create())
            {
                aesAlg.Key = aesProperties.Key;
                aesAlg.IV = aesProperties.InitializationVector;

                // Create a decrytor to perform the stream transform.
                System.Security.Cryptography.ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (System.Security.Cryptography.CryptoStream csEncrypt = new System.Security.Cryptography.CryptoStream(msEncrypt, encryptor, System.Security.Cryptography.CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }
            return Convert.ToBase64String(encrypted);
        }


        public static string Decrypt(string cipherString)
        {
            byte[] cipherText = Convert.FromBase64String(cipherString);
            // Check arguments.
            if (cipherText == null || cipherText.Length <= 0)
                throw new ArgumentNullException("cipherText");
            if (aesProperties.Key == null || aesProperties.Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (aesProperties.InitializationVector == null || aesProperties.InitializationVector.Length <= 0)
                throw new ArgumentNullException("Key");

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            // Create an Aes object
            // with the specified key and IV.
            using (System.Security.Cryptography.Aes aesAlg = System.Security.Cryptography.Aes.Create())
            {
                aesAlg.Key = aesProperties.Key;
                aesAlg.IV = aesProperties.InitializationVector;

                // Create a decrytor to perform the stream transform.
                System.Security.Cryptography.ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (System.Security.Cryptography.CryptoStream csDecrypt = new System.Security.Cryptography.CryptoStream(msDecrypt, decryptor, System.Security.Cryptography.CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {

                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }

            }
            return plaintext;
        }

        //public static readonly string RIJNDAEL_PROPERTIES_PATH = "rijnndael-properties.bin";
        //private static RijndaelProperties rijndaelProperties;

        //public static void LoadRijndaelProperties()
        //{
        //    rijndaelProperties = ReadFromBinaryFile<RijndaelProperties>(RIJNDAEL_PROPERTIES_PATH);
        //}

        //public static void GenerateKeyAndInitializationVectorIfNeeded()
        //{
        //    if (!File.Exists(RIJNDAEL_PROPERTIES_PATH))
        //    {
        //        using (Rijndael myRijndael = Rijndael.Create())
        //        {
        //            RijndaelProperties rijndaelProperties = new RijndaelProperties { InitializationVector = myRijndael.IV, Key = myRijndael.Key };
        //            WriteToBinaryFile<RijndaelProperties>(RIJNDAEL_PROPERTIES_PATH, rijndaelProperties);
        //        }
        //    }
        //}

        //public static string Encrypt(string plainText)
        //{
        //    // Check arguments.
        //    if (plainText == null || plainText.Length <= 0)
        //        throw new ArgumentNullException("plainText");
        //    if (rijndaelProperties.Key == null || rijndaelProperties.Key.Length <= 0)
        //        throw new ArgumentNullException("Key");
        //    if (rijndaelProperties.InitializationVector == null || rijndaelProperties.InitializationVector.Length <= 0)
        //        throw new ArgumentNullException("Key");
        //    byte[] encrypted;
        //    // Create an Rijndael object
        //    // with the specified key and IV.
        //    using (Rijndael rijAlg = Rijndael.Create())
        //    {
        //        rijAlg.Key = rijndaelProperties.Key;
        //        rijAlg.IV = rijndaelProperties.InitializationVector;

        //        // Create a decrytor to perform the stream transform.
        //        ICryptoTransform encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);

        //        // Create the streams used for encryption.
        //        using (MemoryStream msEncrypt = new MemoryStream())
        //        {
        //            using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
        //            {
        //                using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
        //                {
        //                    //Write all data to the stream.
        //                    swEncrypt.Write(plainText);
        //                }
        //                encrypted = msEncrypt.ToArray();
        //            }
        //        }
        //    }
        //    // Return the encrypted bytes from the memory stream.
        //    return Convert.ToBase64String(encrypted);
        //}

        //public static string Decrypt(string cipherString)
        //{
        //    byte[] cipherText = Convert.FromBase64String(cipherString);
        //    // Check arguments.
        //    if (cipherText == null || cipherText.Length <= 0)
        //        throw new ArgumentNullException("cipherText");
        //    if (rijndaelProperties.Key == null || rijndaelProperties.Key.Length <= 0)
        //        throw new ArgumentNullException("Key");
        //    if (rijndaelProperties.InitializationVector == null || rijndaelProperties.InitializationVector.Length <= 0)
        //        throw new ArgumentNullException("Key");

        //    // Declare the string used to hold
        //    // the decrypted text.
        //    string plaintext = null;

        //    // Create an Rijndael object
        //    // with the specified key and IV.
        //    using (Rijndael rijAlg = Rijndael.Create())
        //    {
        //        rijAlg.Key = rijndaelProperties.Key;
        //        rijAlg.IV = rijndaelProperties.InitializationVector;

        //        // Create a decrytor to perform the stream transform.
        //        ICryptoTransform decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

        //        // Create the streams used for decryption.
        //        using (MemoryStream msDecrypt = new MemoryStream(cipherText))
        //        {
        //            using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
        //            {
        //                using (StreamReader srDecrypt = new StreamReader(csDecrypt))
        //                {
        //                    // Read the decrypted bytes from the decrypting stream
        //                    // and place them in a string.
        //                    plaintext = srDecrypt.ReadToEnd();
        //                }
        //            }
        //        }

        //    }
        //    return plaintext;
        //}

        //private static void WriteToBinaryFile<T>(string filePath, T objectToWrite)
        //{
        //    using (Stream stream = File.Open(filePath, FileMode.Create))
        //    {
        //        var binaryFormatter = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
        //        binaryFormatter.Serialize(stream, objectToWrite);
        //    }
        //}

        ///// <summary>
        ///// Reads an object instance from a binary file.
        ///// </summary>
        ///// <typeparam name="T">The type of object to read from the XML.</typeparam>
        ///// <param name="filePath">The file path to read the object instance from.</param>
        ///// <returns>Returns a new instance of the object read from the binary file.</returns>
        //private static T ReadFromBinaryFile<T>(string filePath)
        //{
        //    using (Stream stream = File.Open(filePath, FileMode.Open))
        //    {
        //        var binaryFormatter = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
        //        return (T)binaryFormatter.Deserialize(stream);
        //    }
        //}

    }
}