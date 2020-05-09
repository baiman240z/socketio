import $ from 'jquery';
// @ts-ignore
import Vue from 'vue/dist/vue';
import {ShogiClient} from "./classes/shogi-client";
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import {Piece} from "./classes/piece";

(() => {
    const client = new ShogiClient(
        location.protocol + '//' + location.host,
        (data: Piece[]) => {
            client.pieces = data;
            app.pieces = client.pieces;
            app.$nextTick(() => {
                setEvent();
            });
        }
    );

    const app = new Vue({
        el: '#board',
        data: {
            pieces: client.pieces
        },
        methods: {
            getPiece: function (pos: number): Piece | any {
                // @ts-ignore
                for (const p of this.pieces) {
                    if (p.position == pos) {
                        return p;
                    }
                }
                return null;
            }
        }
    });

    $('#board').on('click', '.piece', function() {
        const id = parseInt(<string>$(this).attr('piece-id'));
        client.reversePiece(id);
    });

    const setEvent = () => {
        $('.piece').draggable({
            revert: "invalid"
        });
        $('#board .cell').droppable({
            drop: function (e, ui) {
                const draggable = $(ui.draggable[0]);
                const dragPieceId = parseInt(<string>draggable.attr('piece-id'));
                const dropCellNo = parseInt(<string>$(this).attr('cell-no'));
                client.movePiece(dragPieceId, dropCellNo);
                app.pieces = client.pieces;
                draggable
                    .css('top', '0')
                    .css('left', '0');
                app.$nextTick(() => {
                    $('.piece').draggable({
                        revert: "invalid"
                    });
                });
            }
        });
    };

    app.$nextTick(() => {
        setEvent();
    });

})();
