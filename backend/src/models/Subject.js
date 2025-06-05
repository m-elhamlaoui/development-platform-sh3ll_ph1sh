const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subject = sequelize.define('Subject', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    level: {
      type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  // Add any associations here
  Subject.associate = (models) => {
    Subject.hasMany(models.File, {
      foreignKey: 'subjectId',
      as: 'files'
    });
  };

  return Subject;
}; 