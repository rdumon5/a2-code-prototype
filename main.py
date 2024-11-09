# intro
scene.set_background_color(9)
game.splash("Start Game")
game.show_long_text("Collect as much trash as possible within 30 seconds, but be quick!", DialogLayout.BOTTOM)
game.show_long_text("Make sure to gather it before the bird has a chance to pick it up!", DialogLayout.BOTTOM)

# gameplay
info.start_countdown(30)
scene.set_background_image(assets.image("""background"""))

trash: Sprite = None
bird: Sprite = None
hero: Sprite = None

def create_trash():
    global trash
    trash = sprites.create(img("""
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
    """), SpriteKind.projectile)
    trash.set_position(randint(0, scene.screen_width()), randint(0, scene.screen_height()))

def create_bird():
    global bird
    if bird is None:
        bird = sprites.create(assets.image("""bird"""), SpriteKind.enemy)
        bird.set_position(randint(0, scene.screen_width()), randint(0, scene.screen_height()))
        bird.follow(trash, 16)

# initialize sprites
create_trash()
create_bird()

hero = sprites.create(assets.image("""hero"""), SpriteKind.player)
controller.move_sprite(hero)
hero.set_stay_in_screen(True)

def on_on_overlap_bird_trash(bird, trash):
    # when the bird overlaps with the trash, the player loses a life
    info.change_life_by(-1)
    music.power_down.play()
    trash.destroy(effects.spray, 100)
    create_trash()  # respawn new trash
    if bird is not None:
        bird.follow(trash, 17)  # ensure the bird follows the new trash

# update function for hero and bird overlaps
def on_on_overlap_hero_bird(hero, bird):
    # when the hero overlaps with the bird, do nothing or provide feedback
    pass

# bind the overlap events
sprites.on_overlap(SpriteKind.enemy, SpriteKind.projectile, on_on_overlap_bird_trash)
sprites.on_overlap(SpriteKind.player, SpriteKind.enemy, on_on_overlap_hero_bird)

def on_on_overlap2(hero, trash):
    trash.destroy(effects.spray, 100)
    info.change_score_by(1)
    music.ba_ding.play()

    # respawn both trash and bird
    create_trash()

    # ensure bird continues to follow the new trash
    if bird is not None:
        bird.follow(trash, 17)

def update_bird_follow():
    if bird is not None and trash is not None:
        bird.follow(trash, 17)

sprites.on_overlap(SpriteKind.player, SpriteKind.projectile, on_on_overlap2)

# call this function to update the bird's following behavior
game.on_update(update_bird_follow)

def on_life_zero():
    sprites.destroy(hero, effects.fire, 500)
    game.game_over(False)
