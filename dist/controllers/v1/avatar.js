"use strict";
/* istanbul ignore next */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
/* istanbul ignore next */
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
/* istanbul ignore next */
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
/* istanbul ignore next */
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* istanbul ignore next */
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const Filter_1 = require("../../helpers/Filter");
const model = require("../../models/models");
const controller_1 = require("../controller");
const common_1 = require("@tsed/common");
const auth_1 = require("../../dal/auth");
const Auth_1 = require("../../middleware/Auth");
const swagger_1 = require("@tsed/swagger");
let AvatarController = class AvatarController extends controller_1.default {
    constructor() {
        super();
    }
    async update(userInfo, body) {
        let LegRGB = body.LegRGB;
        let HeadRGB = body.HeadRGB;
        let TorsoRGB = body.TorsoRGB;
        let Hats = body.Hats;
        let Face = body.Face;
        let TShirt = body.TShirt;
        let Shirt = body.Shirt;
        let Pants = body.Pants;
        let canEdit = await this.avatar.canUserModifyAvatar(userInfo.userId);
        if (!canEdit) {
            throw new this.BadRequest('AvatarCooldown');
        }
        const LegArray = Filter_1.filterRGB([...LegRGB]);
        const TorsoArray = Filter_1.filterRGB([...TorsoRGB]);
        const HeadArray = Filter_1.filterRGB([...HeadRGB]);
        if (!LegArray || !HeadArray || !TorsoArray) {
            throw new this.BadRequest('InvalidCatalogIds');
        }
        const jsonArray = {
            "UserId": userInfo.userId,
            "Leg": LegArray,
            "Head": HeadArray,
            "Torso": TorsoArray,
            "Hats": {
                Texture: [],
                OBJ: [],
                MTL: [],
            },
            "Face": false,
            "Gear": false,
            "TShirt": false,
            "Shirt": false,
            "Pants": false,
        };
        const filteredHats = Array.from(new Set(Hats));
        if (typeof Face === "number") {
            filteredHats.push(Face);
        }
        if (typeof TShirt === "number") {
            filteredHats.push(TShirt);
        }
        if (typeof Shirt === "number") {
            filteredHats.push(Shirt);
        }
        if (typeof Pants === "number") {
            filteredHats.push(Pants);
        }
        const insertArray = [];
        for (const catalogId of filteredHats) {
            if (isNaN(catalogId)) {
                throw new this.BadRequest('InvalidCatalogIds');
            }
            let owns = await this.user.getUserInventoryByCatalogId(userInfo.userId, catalogId);
            if (owns.length <= 0) {
                throw new this.BadRequest('InvalidCatalogIds');
            }
            if (owns[0]) {
                const moderated = await this.catalog.getInfo(owns[0].catalogId, ['status']);
                if (moderated.status !== model.catalog.moderatorStatus.Ready) {
                    continue;
                }
                const assets = await this.catalog.getCatalogItemAssets(owns[0].catalogId);
                if (owns[0].category === model.catalog.category.Hat || owns[0].category === model.catalog.category.Gear) {
                    for (const asset of assets) {
                        switch (asset.assetType) {
                            case model.catalog.assetType.MTL: {
                                jsonArray.Hats.MTL.push(asset.fileName + '.' + asset.fileType);
                                break;
                            }
                            case model.catalog.assetType.OBJ: {
                                jsonArray.Hats.OBJ.push(asset.fileName + '.' + asset.fileType);
                                break;
                            }
                            case model.catalog.assetType.Texture: {
                                jsonArray.Hats.Texture.push(asset.fileName + '.' + asset.fileType);
                                break;
                            }
                        }
                    }
                }
                if (owns[0].category === model.catalog.category.Gear) {
                    jsonArray.Gear = true;
                }
                else if (owns[0].category === model.catalog.category.Faces) {
                    for (const asset of assets) {
                        switch (asset.assetType) {
                            case model.catalog.assetType.Texture: {
                                jsonArray.Face = { Texture: [] };
                                jsonArray.Face.Texture.push(asset.fileName + '.' + asset.fileType);
                                break;
                            }
                        }
                    }
                }
                else if (owns[0].category === model.catalog.category.TShirt) {
                    for (const asset of assets) {
                        switch (asset.assetType) {
                            case model.catalog.assetType.Texture: {
                                jsonArray.TShirt = { Texture: [] };
                                jsonArray.TShirt.Texture.push(asset.fileName + '.' + asset.fileType);
                                break;
                            }
                        }
                    }
                }
                else if (owns[0].category === model.catalog.category.Shirt) {
                    for (const asset of assets) {
                        switch (asset.assetType) {
                            case model.catalog.assetType.Texture: {
                                jsonArray.Shirt = { Texture: [] };
                                jsonArray.Shirt.Texture.push(asset.fileName + '.' + asset.fileType);
                                break;
                            }
                        }
                    }
                }
                else if (owns[0].category === model.catalog.category.Pants) {
                    for (const asset of assets) {
                        switch (asset.assetType) {
                            case model.catalog.assetType.Texture: {
                                jsonArray.Pants = { Texture: [] };
                                jsonArray.Pants.Texture.push(asset.fileName + '.' + asset.fileType);
                                break;
                            }
                        }
                    }
                }
                else if (owns[0].category === model.catalog.category.Head) {
                    if (!jsonArray.Character) {
                        jsonArray.Character = {};
                    }
                    if (!jsonArray.Character.Head) {
                        jsonArray.Character.Head = {
                            Texture: [],
                            OBJ: [],
                            MTL: [],
                        };
                    }
                    const arr = jsonArray.Character.Head;
                    for (const asset of assets) {
                        switch (asset.assetType) {
                            case model.catalog.assetType.MTL: {
                                arr.MTL.push(asset.fileName + '.' + asset.fileType);
                                break;
                            }
                            case model.catalog.assetType.OBJ: {
                                arr.OBJ.push(asset.fileName + '.' + asset.fileType);
                                break;
                            }
                            case model.catalog.assetType.Texture: {
                                arr.Texture.push(asset.fileName + '.' + asset.fileType);
                                break;
                            }
                        }
                    }
                }
                insertArray.push({
                    userId: userInfo.userId,
                    catalogId: owns[0].catalogId,
                    category: owns[0].category,
                });
            }
        }
        await this.avatar.deleteAvatar(userInfo.userId);
        await this.avatar.multiAddItemsToAvatar(insertArray);
        await this.avatar.deleteAvatarColoring(userInfo.userId);
        await this.avatar.addAvatarColors(userInfo.userId, HeadRGB, LegRGB, TorsoRGB);
        (async () => {
            try {
                let avatar = await this.avatar.getThumbnailHashUrl(jsonArray);
                avatar = false;
                if (!avatar) {
                    console.log(JSON.stringify(jsonArray));
                    avatar = await this.avatar.renderAvatar('avatar', jsonArray);
                    await this.avatar.recordThumbnailHash(jsonArray, avatar);
                }
                else {
                    console.log("Hash Found!");
                }
                console.log(avatar);
                if (avatar) {
                    console.log('avatar found');
                    await this.avatar.deletedOldAvatarUrl(userInfo.userId);
                    await this.avatar.addAvatarUrl(userInfo.userId, avatar);
                    await this.avatar.publishAvatarUpdateFinished(userInfo.userId, avatar);
                }
                else {
                    console.log('avatar not found');
                    console.log(avatar);
                }
            }
            catch (e) {
                console.log(e);
            }
        })();
        return { success: true };
    }
    async pollForChanges(userInfo) {
        let result = await this.avatar.setupAvatarUpdateListener(userInfo.userId);
        if (result) {
            return {
                url: result,
            };
        }
        else {
            throw new this.BadRequest('NoUpdates');
        }
    }
};
__decorate([
    common_1.Patch('/'),
    swagger_1.Summary('Update the authenticated users avatar'),
    common_1.UseBeforeEach(auth_1.csrf),
    common_1.UseBefore(Auth_1.YesAuth),
    swagger_1.Returns(400, { type: model.Error, description: 'AvatarCooldown: You cannot update your avatar right now\nInvalidCatalogIds: One or more of the catalog ids specified are invalid and/or not owned by the authenticated user\n' }),
    __param(0, common_1.Locals('userInfo')),
    __param(1, common_1.BodyParams(model.avatar.UpdateAvatarPayload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [model.user.UserInfo, model.avatar.UpdateAvatarPayload]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "update", null);
__decorate([
    common_1.Get('/poll'),
    swagger_1.Summary("Poll for avatar changes. Timeout is set to 20 seconds, but it may be increased in the future"),
    swagger_1.Returns(400, { type: model.Error, description: 'NoUpdates: No updates are available\n' }),
    __param(0, common_1.Locals('userInfo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [model.user.UserInfo]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "pollForChanges", null);
AvatarController = __decorate([
    common_1.Controller('/avatar'),
    __metadata("design:paramtypes", [])
], AvatarController);
exports.default = AvatarController;

