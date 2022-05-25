const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING, 
    unique: true,
  },
  password: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.STRING, 
    defaultValue: "USER"
  },
  username: {
    type: DataTypes.STRING, 
    unique: true
  },
  img: {
    type: DataTypes.STRING, 
    allowNull: true
  }
})

const Offer = sequelize.define('offer', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  },
  project: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wallet: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price:{
    type: DataTypes.STRING,
    allowNull: false,
  }
}) 

const PurchaseOffer = sequelize.define('purchaseoffer', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  },
  project: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wallet: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price:{
    type: DataTypes.STRING,
    allowNull: false,
  }
})

const OfferMarks = sequelize.define('offermarks', {
  offers: DataTypes.ARRAY(DataTypes.INTEGER),
})

const Rating = sequelize.define('rating', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  },  
  rate: {type: DataTypes.INTEGER, allowNull: false},
  ratedId: {
    type: DataTypes.INTEGER, 
  }
})

const Comments = sequelize.define('comments', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  },  
  body: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  commentedId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
})

User.hasMany(Comments, {
  foreignKey: {
  type: DataTypes.INTEGER,
  allowNull: true
  }
})
Comments.belongsTo(User)

User.hasMany(Rating, {
  foreignKey: {
  type: DataTypes.INTEGER,
  allowNull: true
  }
})
Rating.belongsTo(User)

const Chat = sequelize.define('chat',{
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  },
  recipients: DataTypes.ARRAY(DataTypes.INTEGER),
  content: DataTypes.ARRAY(DataTypes.INTEGER),
})

const Message = sequelize.define('message',{
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  },
  body: {
    type: DataTypes.STRING(500),
    allowNull: false,
  }
})

User.hasMany(Message, {
  foreignKey: {
  type: DataTypes.INTEGER,
  allowNull: true
  }
})
Message.belongsTo(User)

Chat.hasMany(Message, {
  foreignKey: {
  type: DataTypes.INTEGER,
  allowNull: true
  }
})
Message.belongsTo(Chat)

User.hasMany(Offer, {
  foreignKey: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})
Offer.belongsTo(User)

User.hasMany(PurchaseOffer, {
  foreignKey: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})
PurchaseOffer.belongsTo(User)

User.hasMany(OfferMarks, {
  foreignKey: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})
OfferMarks.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

module.exports = {
  User, Offer, Rating, PurchaseOffer, OfferMarks, Chat, Message, Comments
}