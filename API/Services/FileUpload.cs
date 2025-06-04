using System;
using System.Runtime.InteropServices.Marshalling;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace API.Services;

public class FileUpload
{
    public static async Task<string> Upload(IFormFile file)
    {
        var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

        if (!Directory.Exists(uploadFolder))
        {
            Directory.CreateDirectory(uploadFolder);
        }

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadFolder, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await stream.CopyToAsync(stream);
        return fileName;
    }   

}
