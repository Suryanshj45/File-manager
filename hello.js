#!/usr/bin/env node
let arr=process.argv.slice(2);
//console.log(arr);
let command=arr[0];
let fs=require("fs");
let path=require("path");
let types = {
    media: ["mp4", "mkv"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    document: ["docx", "doc", "pdf", "xlsx", "odt", "ods", "odp", "odg", "txt"],
    app: ["exe", "dmg", "pkg", "deb"]
  };
  
switch(command)
{
    case "tree":
        treefn(arr[1]);
        break;
    case "organise":
        organisefn(arr[1]);
        break;
    case "help":
        helpfn();
        break;
    default:
        console.log("Please Enter the right  command!!");
        break;
}
// function for the tree command
function treefn(dirpath)
{
    if(dirpath==undefined)
    {
        treehelper(process.cwd(),"");
    return;
    }
    else
    {
      let val=fs.existsSync(dirpath);
      if(val)
      {
          treehelper(dirpath,"");
      }
      else
      {
      console.log("Kindly Enter the path of the directory!!");
          return;
      }
    }
}
function treehelper(dirpath,indent)
{
    let isfile=fs.lstatSync(dirpath).isFile();
    if(isfile)
    {
        let filename=path.basename(dirpath);
        console.log(indent+"├───"+filename);
    }
    else
    {
        let dirname=path.basename(dirpath);
        console.log(indent+"└───"+dirname);
        let childrens=fs.readdirSync(dirpath);
        for(let i=0;i<childrens.length;i++)
        {
            let temp=path.join(dirpath,childrens[i]);
            treehelper(temp,indent+"\t");
        }
    }

}

// function for the organise command
function organisefn(dirpath)
{
   // console.log("Organise command is implemented for: ",dirpath);
    /*1. input->directory path given
      2. create-> organised files->idrectory
      3. check all files to which category they belong
      4. copy files to that folder to which that belong according to the category*/
      let destpath;
      if(dirpath==undefined)
      {
        destpath=process.cwd();
      return;
      }
      else
      {
        let val=fs.existsSync(dirpath);
        if(val)
        {
             destpath=path.join(dirpath,"organized_file");
            if(!(fs.existsSync(destpath)))
            {
               fs.mkdirSync(destpath);
            }
            organisehelper(dirpath,destpath);
            
        }
        else
        {
        console.log("Kindly Enter the path of the directory!!");
            return;
        }
      }



}

function organisehelper(dirpath,destpath)
{
    let childnames=fs.readdirSync(dirpath);
    //console.log(childnames);
    for(let i=0;i<childnames.length;i++)
    {
        let address=path.join(dirpath,childnames[i]);
        let isfile=fs.lstatSync(address).isFile();
        if(isfile)
        {
            let category=getCategory(childnames[i]);
            sendfiles(address,destpath,category);
            

        }
    }
}
function getCategory(name)
{
    let ext=path.extname(name);
    ext=ext.slice(1);
   // console.log(ext);
    for(let type in types)
    {
        let temp=types[type];
        for(let j=0;j<temp.length;j++)
        {
            if(temp[j]==ext)
            return type;
        }
    }
    return "others";
}
function sendfiles(address,destpath,category)
{
    let categorypath=path.join(destpath,category);
    if(fs.existsSync(categorypath)==false)
    {
        fs.mkdirSync(categorypath);
    }
    let filepath=path.basename(address);
    let destfilepath=path.join(categorypath,filepath);
    fs.copyFileSync(address,destfilepath);
    //fs.unlinkSync(address);
    //console.log(filepath,'copied to',destfilepath);


}


// function for the help command
function helpfn()
{
    console.log(`
    List of All the commands:
                node main.js tree
                node main.js organise
                node main.js help
    `);
}