// Handles user profile and user data requests
const userService = require('../services/userService');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await userService.getProfileById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified,
                proposeContributions: user.proposecontribution || [],
                fixContributions: user.fixcontribution || []
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get profile'
        });
    }
};


exports.updateProfile = async (req, res) => {

    try {
        const name = req.body.name;
        const userId = req.user.userId;
        if(!name){
               return res.status(404).json({
                success: false,
                error: 'name is required'
            });
        }

        const user = await userService.updateProfile(name, userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified,
                proposeContributions: user.proposecontribution || [],
                fixContributions: user.fixcontribution || []
            }
        });



    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update profile'
        });
    }

    

}

exports.getUsersCount= async (req,res) => {
    try {
        console.log("hi")
        const {count,error}=await userService.getUsersCount()
        if (error) {
            return res.status(400).json({
                error:error.message
            })
        }
        res.status(200).json({
            count:count
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}
