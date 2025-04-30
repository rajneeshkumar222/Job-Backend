
// router.post("/addcompany",authenticateToken,async(req,res)=>{
//     try{
//         const {companyname}=req.body;
//         if(!companyname){
//             return res.status(500).json({
//                 message:"Company Name is required !",
//                 success:false,
//             })
//         };
//         let company = await Company.findOne({ name: companyname });
//         if(company){
//             return res.status(404).json({
//                 message:"Company Name Already Register!",
//                 success:false,
//             })
//         };
//         company=await Company.create({

//             name:companyname,
//             id:req.body.id
//         })
//         return res.status(200).json({
//             message:"Company Added Successfully !",
//             data:company,
//             success:true,
//         })
//     }
//     catch(e){
//         return res.status(500).json({
//             message:"Something Error while adding company !",
//             success:false,
//         })
//     }
// })

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./authentcation");
const Company = require("../model/company");

router.post("/addcompany", authenticateToken, async (req, res) => {
    try {
        const { companyname, position, skills, country, website } = req.body;

        if (!companyname || !position || !skills || !country || !website) {
            return res.status(400).json({
                message: "All fields (companyname, position, skills, country, website) are required!",
                success: false,
            });
        }

        let company = await Company.findOne({ name: companyname });

        if (company) {
            return res.status(400).json({
                message: "Company Name Already Registered!",
                success: false,
            });
        }

        company = await Company.create({
            name: companyname,
            position,
            skills,  
            country,
            website,
        });

        return res.status(200).json({
            message: "Company Added Successfully!",
            data: company,
            success: true,
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong while adding the company!",
            error: e.message,
            success: false,
        });
    }
});

router.get("/getcompany",async(req,res)=>{
    try{
      const {companyid}=req.headers;
      if(!companyid){
        return res.status(404).json({
            message: "Companies id  not found.",
            success: false
        })
      };
      const company=await Company.findById(companyid);
      if(!company){
        return res.status(404).json({
            message: "Companies not found.",
            success: false
        })
      };
      return res.status(202).json({
        message: "Companie Found .",
        ComanayData:company,
        success: true
    })
    }
    catch(e){
        return res.status(404).json({
            message: "Something Error while get company!.",
            success: false
        })
    }
})
router.get("/getallcompanies", async (req, res) => {
    try {
      const companies = await Company.find({});
      res.status(200).json({
        success: true,
        companies,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch companies",
      });
    }
  });
  

router.put("/updatecompany",authenticateToken,async(req,res)=>{
    try{
      const {companyid}=req.headers;
      if(!companyid){
        return res.status(404).json({
            message: "Companies id  not found.",
            success: false
        })
    };
    const company=await Company.findByIdAndUpdate(companyid);
    return res.status(201).json({
        message: "Companies is Upadted Successfully.",
        Updatadata:company,
        success: true
    })
    
    }
    catch(e){
        return res.status(404).json({
            message: "Something Error !.",
            success: false
        })
    }
})

router.delete("/deletecompany",authenticateToken,async(req,res)=>{
    try{
        const {companyid}=req.headers;
        if(!companyid){
          return res.status(404).json({
              message: "Companies id  not found.",
              success: false
          })
      };
       const company=await Company.findByIdAndDelete(companyid);
      if(!company){
        return res.status(404).json({
            message: "Companies not found.",
            success: false
        })
    };
        return res.status(200).json({
            message: "Companies deleted successfully.",
            success: true
        });
    }
    catch(e){
        return res.status(404).json({
            message: "Something Error!.",
            Error:e,
        })
    }
})


module.exports = router; 
