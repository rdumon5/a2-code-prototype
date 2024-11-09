//  intro
scene.setBackgroundColor(9)
game.splash("Start Game")
game.showLongText("Collect as much trash as possible within 30 seconds, but be quick!", DialogLayout.Bottom)
game.showLongText("Make sure to gather it before the bird has a chance to pick it up!", DialogLayout.Bottom)
//  gameplay
info.startCountdown(30)
scene.setBackgroundImage(assets.image`background`)
let trash : Sprite = null
let bird : Sprite = null
let hero : Sprite = null
function create_trash() {
    
    trash = sprites.create(img`
        ....................
        ....................
        ....................
        ....................
        ....................
        ....................
        ........6fff........
        .......ffffff.......
        .........cc.........
        .........bc.........
        ........bbb6........
        .......bbbb66.......
        ......66bbbbbb......
        .....b6bbbbb6bb.....
        .....bbbbbb66bb.....
        .....bb66bbbbbb.....
        ......bb6bbbbb......
        .......ffffff.......
        ....................
        ....................
    `, SpriteKind.Projectile)
    trash.setPosition(randint(0, scene.screenWidth()), randint(0, scene.screenHeight()))
}

function create_bird() {
    
    if (bird === null) {
        bird = sprites.create(assets.image`bird`, SpriteKind.Enemy)
        bird.setPosition(randint(0, scene.screenWidth()), randint(0, scene.screenHeight()))
        bird.follow(trash, 16)
    }
    
}

//  initialize sprites
create_trash()
create_bird()
hero = sprites.create(assets.image`hero`, SpriteKind.Player)
controller.moveSprite(hero)
hero.setStayInScreen(true)
//  ensure the bird follows the new trash
//  update function for hero and bird overlaps
//  bind the overlap events
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Projectile, function on_on_overlap_bird_trash(bird: Sprite, trash: Sprite) {
    //  when the bird overlaps with the trash, the player loses a life
    info.changeLifeBy(-1)
    music.powerDown.play()
    trash.destroy(effects.spray, 100)
    create_trash()
    //  respawn new trash
    if (bird !== null) {
        bird.follow(trash, 17)
    }
    
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function on_on_overlap_hero_bird(hero: Sprite, bird: Sprite) {
    //  when the hero overlaps with the bird, do nothing or provide feedback
    
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function on_on_overlap2(hero: Sprite, trash: Sprite) {
    trash.destroy(effects.spray, 100)
    info.changeScoreBy(1)
    music.baDing.play()
    //  respawn both trash and bird
    create_trash()
    //  ensure bird continues to follow the new trash
    if (bird !== null) {
        bird.follow(trash, 17)
    }
    
})
//  call this function to update the bird's following behavior
game.onUpdate(function update_bird_follow() {
    if (bird !== null && trash !== null) {
        bird.follow(trash, 17)
    }
    
})
function on_life_zero() {
    sprites.destroy(hero, effects.fire, 500)
    game.gameOver(false)
}

