const { prismaWrite, prismaRead } = require("../db");
const redis = require("../redis");  
const { dbHandler } = require("./ControllerHelper");

 
const CACHE_TTL = 3600;  

const getCache = async (key) => {
  try {
    const data = await redis.get(key);

    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Redis GET error:", err.message);
    return null;  
  }
};

const setCache = async (key, value, ttl = CACHE_TTL) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch (err) {
    console.error("Redis SET error:", err.message);
  
  }
};

const delCache = async (key) => {
  try {
    await redis.del(key);
  } catch (err) {
    console.error("Redis DEL error:", err.message);
  }
};
// ================= 

const createNote = async (req, res) => {
  const { content, name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Name is required",
    });
  }

  const trimmedName = name.trim();

  return dbHandler(req, res, async () => {
    await prismaWrite.note.create({
      data: {
        name: trimmedName,
        content: content || "",
      },
    });

    await delCache(`cache:${trimmedName}`);

    return res.status(201).json({
      status: 201,
      message: "note created",
    });
  });
};

const getNote = async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Note name is required",
    });
  }

  const trimmedName = name.trim();
  const cacheKey = `cache:${trimmedName}`;

  try {
 
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log("fetched note from cache");
      return res.status(200).json({
        status: 200,
        message: "fetched note",
        data: cached,
      });
    }

 
    const note = await prismaRead.note.findUnique({
      where: { name: trimmedName },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!note) {
      return res.status(404).json({
        status: 404,
        message: "Note not found",
      });
    }

 
    await setCache(cacheKey, note);

    return res.status(200).json({
      status: 200,
      message: "fetched note",
      data: note,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};

const updateNote = async (req, res) => {
  const { name, newName, content } = req.body;

  if (!newName || newName.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Note name is required",
    });
  }

  const trimmedName = newName.trim();

 
  if (content !== undefined && typeof content !== "string") {
    return res.status(400).json({
      status: 400,
      message: "Content must be a string",
    });
  }

 
  const updateData = {
    name: trimmedName,
    content: content,
  };

  try {
    await prismaWrite.note.update({
      where: { name: name },
      data: updateData,
    });

  
    await delCache(`cache:${name}`);

    
    if (name !== trimmedName) {
      await delCache(`cache:${trimmedName}`);
    }

    return res.status(200).json({
      status: 200,
      message: "note updated",
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({
        status: 409,
        message: "A note with the new name already exists",
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        status: 404,
        message: "Note not found",
      });
    }

    return res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};

const createComment = async (req, res) => {
  const { name, content } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Note name is required",
    });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Comment content is required",
    });
  }

  const trimmedName = name.trim();

  try {
    const note = await prismaRead.note.findUnique({
      where: { name: trimmedName },
    });

    if (!note) {
      return res.status(404).json({
        status: 404,
        message: "Note not found",
      });
    }

    await prismaWrite.comment.create({
      data: {
        noteId: note.id,
        content: content,
      },
    });

    
    await delCache(`cache:${trimmedName}`);

    return res.status(201).json({
      status: 201,
      message: "comment created",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};

const createTag = async (req, res) => {
  const { name, slug ,noteId,valid} = req.body;
  if(typeof name !== "string" && typeof slug !== "string" && name.trim()==="" && slug.trim()===""){
    return res.status(400).json({
      status:400,
      message:"name and slug is required"
    })
  }

   

  return dbHandler(req, res, async () => {
    const newTag = await prismaWrite.tag.create({
      data: {
        name,
        slug,
      },
    });

    if(noteId){
       await prismaWrite.noteTag.create({
        data:{
          noteId:noteId,
          tagId:newTag.id,
          valid:true
        }
       })

        return res.status(201).json({
        status:201,
        message:"Created Tag for note"
      })
    }

      return res.status(201).json({
      status:201,
      message:"Created Tag"
    })
  });

 

};

const practice = async(req,res)=>{
  const {name} = req.body;
 
  return dbHandler(req,res,async()=>{
     const data= await prismaWrite.note.findMany({
        where:{name:{contains:"my note 2"}},
        include:{
           comments:{
             orderBy: { createdAt: "desc" },
           },
           tags:{
             where:{
              tag:{slug:{contains:"slug of tag 4"}}
            },
             include:{
                 tag:true
             }
           }
        },
        
      });

      return res.status(201).json({
      status:201,
      data:data
    })

  })

}

module.exports = {
  practice,
  createNote,
  getNote,
  updateNote,
  createComment,
  createTag
};
